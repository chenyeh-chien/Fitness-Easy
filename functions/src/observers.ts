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