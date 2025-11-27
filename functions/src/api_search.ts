import {onCall, HttpsError, CallableRequest} from "firebase-functions/v2/https";
import axios from "axios";

const TFDA_API_URL = "https://data.fda.gov.tw/api/v2/FoodNutrient";

export const getTfdaFoodData = onCall(
  async (request: CallableRequest): Promise<any> => {
    // 1. 身份驗證檢查
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "需要登入才能查詢。"
      );
    }

    // 2. 獲取前端傳入的參數
    const {foodName} = request.data as { foodName: string };

    if (!foodName) {
      throw new HttpsError("invalid-argument", "請提供 foodName 參數。");
    }

    try {
      // 3. 串接 TFDA API
      const response = await axios.get(TFDA_API_URL, {
        params: {
          "$filter": `食物名稱 like '*${foodName}*'`,
          "$format": "json",
        },
      });

      const rawData = response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleanedData = rawData.data.slice(0, 10).map((item: any) => ({
        id: item.ID,
        name: item.食物名稱,
        calorie: item.熱量_kcal,
      }));

      // 4. 返回結果
      return {
        status: "success",
        count: cleanedData.length,
        foods: cleanedData,
      };
    } catch (error: any) {
      console.error("調用 TFDA API 失敗:", error);
      // 5. 拋出 HttpsError 讓前端知道是內部錯誤
      throw new HttpsError(
        "internal",
        `從 TFDA 獲取數據時發生錯誤: ${error.message || error}`
      );
    }
  }
);