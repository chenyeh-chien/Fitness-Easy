import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "./shared";

// 幫助函式：建立一個 unique key (例如: legs_squat)
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
    console.error("New Log:", userId, bodyPart, exercise, weight, date)

    // 檢查數據是否完整
    if (
      !userId ||
      !bodyPart ||
      !exercise ||
      typeof weight !== "number" ||
      !date
    ) {
      console.error("Missing critical data in log. Aborting sync.");
      return;
    }

    // 建立 unique key (例如: 'legs_squat')
    const exerciseKey = createExerciseKey(bodyPart, exercise);

    // latest-weight 文件的參考 (以 userId 為文件 ID)
    const latestStatsRef = db.collection("latest-weight").doc(userId);

    // ----------------------------------------------------
    // 3. 執行 Transaction (交易)
    // ----------------------------------------------------
    await db.runTransaction(async (transaction) => {
      // a. 讀取 latest-weight 文件
      const latestStatsDoc = await transaction.get(latestStatsRef);

      let currentStats: any = {}; // 儲存該動作當前的最新數據

      if (latestStatsDoc.exists) {
        // 如果文件存在，嘗試讀取該動作的數據
        const data = latestStatsDoc.data();
        if (data) {
          currentStats = data[exerciseKey] || {};
        }
      }

      // 取得舊的最新重量
      const oldLatestWeight = currentStats.latest_weight || 0;
      // 取得舊的最新時間戳
      const oldLatestDate = currentStats.latest_date || "1970-01-01"; // 使用一個極早的日期字串作為預設值

      // 檢查本次寫入是否為「最新的紀錄」（以日期字串為準，"YYYY-MM-DD" 格式可直接比較）
      const isNewerLog = date >= oldLatestDate;

      // 只有當它是最新的紀錄時，才需要更新 latest_weight
      if (isNewerLog) {
        const updateData: any = {};

        // 這次最新的重量會成為新的 latest_weight
        updateData[`${exerciseKey}.latest_weight`] = weight;
        updateData[`${exerciseKey}.latest_date`] = date;

        // 前一次的最新重量會成為新的 previous_weight
        // (如果 oldLatestWeight 是 0，表示這是該動作的第一筆紀錄)
        updateData[`${exerciseKey}.previous_weight`] = oldLatestWeight;

        // b. 寫入 latest-weight 文件
        transaction.set(latestStatsRef, updateData, { merge: true });

        console.log(
          `Updated latest stats for ${exerciseKey}. ` +
          `Latest: ${weight}, Previous: ${oldLatestWeight}`
        );
      } else {
        // 如果這次寫入的時間戳比目前最新的紀錄舊，則不需要更新 latest-weight
        console.log(
          "Log is older than current latest. Latest stats unchanged."
        );
      }
    });
  }
);