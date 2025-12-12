import { ref } from 'vue'
import { db } from "@/components/Utils/Firebase/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { formatDateStr } from '@/components/Utils/utilFunctions';

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

  const getDailyTargetsByInterval = async (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const today = new Date(startDate);
      today.setHours(0, 0, 0, 0);
      const startOfDay = formatDateStr(today, false);

      const endOfToday = new Date(endDate);
      endOfToday.setHours(23, 59, 59, 999);
      const endOfDay = formatDateStr(endOfToday, false);

      const q = query(
        collection(db, 'daily-target'),
        where('userId', '==', userId),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily targets by interval:", e);
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
        where('userId', '==', userId),
        orderBy('date', 'desc')
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

  const updateDailyTarget = async (data: any, id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await updateDoc(doc(db, "daily-target", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily target:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteDailyTarget = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await deleteDoc(doc(db, "daily-target", id));
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error deleting body info:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    getDailyTargets,
    getDailyTargetsByDate,
    getDailyTargetsByInterval,
    addDailyTarget,
    updateDailyTarget,
    deleteDailyTarget,
    loading,
    error
  };
}
