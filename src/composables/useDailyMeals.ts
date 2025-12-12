import { ref } from 'vue'
import { db } from "@/components/Utils/Firebase/firebase"
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore'
import { formatDateStr } from '@/components/Utils/utilFunctions';

export function useDailyMeals() {
  const loading = ref(false);
  const error = ref<any>(null);

  const arrangeSummary = (summary: any[]) => {
    return summary.reduce((acc, item) => {
      acc.protein += item.quantity * item.protein;
      acc.carbohydrate += item.quantity * item.carbohydrate;
      acc.fat += item.quantity * item.fat;
      acc.total += item.quantity * (
        item.protein * 4 + item.carbohydrate * 4 + item.fat * 9
      );

      return acc;
    }, { protein: 0, carbohydrate: 0, fat: 0, total: 0 });
  }


  const getDailyMeals = async (
    userId: string,
    time: Date
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const today = new Date(time);
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.getTime();

      const endOfToday = new Date(time);
      endOfToday.setHours(23, 59, 59, 999);
      const endOfDay = endOfToday.getTime();

      const q = query(
        collection(db, 'daily-meals'),
        where('userId', '==', userId),
        where('time', '>=', startOfDay),
        where('time', '<=', endOfDay),
        orderBy('time', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily meals:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getDailyMealsByInterval = async (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const today = new Date(startDate);
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.getTime();

      const endOfToday = new Date(endDate);
      endOfToday.setHours(23, 59, 59, 999);
      const endOfDay = endOfToday.getTime();

      const q = query(
        collection(db, 'daily-meals'),
        where('userId', '==', userId),
        where('time', '>=', startOfDay),
        where('time', '<=', endOfDay),
        orderBy('time', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily meals by interval:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addDailyMeal = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, "daily-meals"), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error adding daily meal:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateDailyMeal = async (
    data: any,
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await updateDoc(doc(db, "daily-meals", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily meal:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteDailyMeal = async (
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await deleteDoc(doc(db, "daily-meals", id));
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily meal:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    arrangeSummary,
    getDailyMeals,
    getDailyMealsByInterval,
    addDailyMeal,
    updateDailyMeal,
    deleteDailyMeal,
    loading,
    error
  };
}
