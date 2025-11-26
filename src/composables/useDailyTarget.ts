import { ref } from 'vue'
import { db } from "@/components/Utils/Firebase/firebase"
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

export function useDailyTarget() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getDailyTargetsByDate = async (
    userId: string,
    date: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'daily-target'),
        where('userId', '==', userId),
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily targets:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getDailyTargets = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'daily-target'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily targets:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addDailyTarget = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
        const docRef = await addDoc(collection(db, "daily-target"), data);
        return docRef;
    } catch (e) {
        error.value = e;
        console.error("Error adding daily target:", e);
        throw e;
    } finally {
        loading.value = false;
    }
  };

  return {
    getDailyTargets,
    getDailyTargetsByDate,
    addDailyTarget,
    loading,
    error
  };
}
