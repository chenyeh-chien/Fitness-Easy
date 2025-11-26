import { ref } from 'vue'
import { db } from "@/components/Utils/Firebase/firebase"
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

export function useDailyMeals() {
  const loading = ref(false);
  const error = ref<any>(null);

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
        /*
        where('time', '>=', startOfDay),
        where('time', '<=', endOfDay)
        */
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

  return {
    getDailyMeals,
    addDailyMeal,
    loading,
    error
  };
}
