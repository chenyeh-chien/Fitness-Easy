import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "./shared";

const createExerciseKey = (bodyPart: string, exercise: string) => {
  const part = bodyPart.toLowerCase().replace(/\s/g, "_");
  const exe = exercise.toLowerCase().replace(/\s/g, "_");
  return `${part}_${exe}`;
};
/**
 * 監聽 daily-workouts 的新增 (Create) 和更新 (Update) 事件。
 * 它會使用 Transaction 來原子性地更新 latest-weight Collection。
 */
export const syncLatestWeight = onDocumentWritten(
  "daily-workouts/{logId}",
  async (event) => {
    // ----------------------------------------------------
    // 1. 處理刪除 (Delete) 事件
    // ----------------------------------------------------
    if (!event.data) {
      // 如果文件被刪除，重新計算最新重量的邏輯會很複雜 (需要查詢歷史紀錄)。
      // 這裡為了簡化，我們跳過刪除事件。
      console.log("Document deleted. Skipping sync.");
      return;
    }

    const change = event.data;

    if (!change.after.exists) {
      console.log("Document deleted (after not exists). Skipping sync.");
      return;
    }

    // ----------------------------------------------------
    // 2. 取得新/更新的紀錄數據
    // ----------------------------------------------------
    const newLog = change.after.data();
    if (!newLog) {
      console.log("No data in newLog");
      return;
    }

    const { userId, bodyPart, exercise, weight, date } = newLog;

    // 檢查數據是否完整
    if (
      !userId ||
      !bodyPart ||
      !exercise ||
      typeof weight !== "number" ||
      !date
    ) {
      console.log("Missing critical data in log. Aborting sync.");
      return;
    }

    const exerciseKey = createExerciseKey(bodyPart, exercise);
    const latestStatsRef = db.collection("latest-weight").doc(userId);

    // ----------------------------------------------------
    // 3. 執行 Transaction (交易)
    // ----------------------------------------------------
    await db.runTransaction(async (transaction) => {
      const latestStatsDoc = await transaction.get(latestStatsRef);

      let currentStats: any = {};

      if (latestStatsDoc.exists) {
        const data = latestStatsDoc.data();
        if (data) {
          currentStats = data[exerciseKey] || {};
        }
      }

      const oldLatestWeight = currentStats.latest_weight || 0;
      const oldLatestDate = currentStats.latest_date || "1970-01-01";
      const isNewerLog = date >= oldLatestDate;

      if (!isNewerLog) {
        console.log(
          "Log is older than current latest. Latest stats unchanged."
        );
        return;
      }

      const updateData: any = {
        [exerciseKey]: {
          latest_weight: weight,
          latest_date: date,
          previous_weight: oldLatestWeight,
        },
      };

      transaction.set(latestStatsRef, updateData, { merge: true });

      console.log(
        `Updated latest stats for ${exerciseKey}. ` +
        `Latest: ${weight}, Previous: ${oldLatestWeight}`
      );
    });
  }
);

export const calculateVolumnLoad = onDocumentWritten(
  "daily-workouts/{logId}",
  async (event) => {
    const targets = new Set<string>();
    
    // Check old data (for update/delete cases or date change)
    if (event.data?.before.exists) {
      const oldData = event.data.before.data();
      if (oldData?.userId && oldData?.date) {
        targets.add(`${oldData.userId}|${oldData.date}`);
      }
    }

    // Check new data (for create/update cases)
    if (event.data?.after.exists) {
      const newData = event.data.after.data();
      if (newData?.userId && newData?.date) {
        targets.add(`${newData.userId}|${newData.date}`);
      }
    }

    console.log('targets: ', targets);

    // Process each affected (userId, date) pair
    const promises = Array.from(targets).map(async (target) => {
      const [userId, date] = target.split('|');

      if (!userId || !date) return;

      // 1. Calculate total volume for this user and date
      const workoutsSnapshot = await db.collection("daily-workouts")
        .where("userId", "==", userId)
        .where("date", "==", date)
        .get();

      let totalVolume = 0;
      workoutsSnapshot.forEach((doc) => {
        const data = doc.data();
        const weight = Number(data.weight) || 0;
        const sets = Number(data.sets) || 0;
        const reps = Number(data.reps) || 0;
        // Volume Load = Weight * Sets * Reps
        totalVolume += weight * sets * reps;
      });

      console.log(`Calculated volume for ${userId} on ${date}: ${totalVolume}`);

      // 2. Update daily-volume-load collection
      const statsQuery = await db.collection("daily-volume-load")
        .where("userId", "==", userId)
        .where("date", "==", date)
        .limit(1)
        .get();

      if (!statsQuery.empty) {
        // Update existing document
        const docId = statsQuery.docs[0].id;
        await db.collection("daily-volume-load").doc(docId).update({
          volumeLoad: totalVolume
        });

        console.log(`Updated daily-volume-load/${docId}`);
      } else {
        // Create new document
        await db.collection("daily-volume-load").add({
          userId,
          date,
          volumeLoad: totalVolume
        });

        console.log(`Created new daily-volume-load document for ${userId} on ${date}`);
      }
    });

    await Promise.all(promises);
  }
);