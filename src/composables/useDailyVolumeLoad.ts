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
  orderBy,
  limit
} from 'firebase/firestore'
import { formatDateStr } from "@/components/Utils/utilFunctions"

export function useDailyVolumeLoad() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getVolumeLoadsByInterval = async (
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
        collection(db, 'daily-volume-load'),
        where('userId', '==', userId),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily volume loads by interval:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getDailyVolumeLoad = async (
    userId: string,
    date: Date
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const formattedDate = formatDateStr(date, false);

      const q = query(
        collection(db, 'daily-volume-load'),
        where('userId', '==', userId),
        where('date', '==', formattedDate)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily volume load:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addDailyVolumeLoad = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      console.log(data)
      const docRef = await addDoc(collection(db, "daily-volume-load"), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error adding daily volume load:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateDailyVolumeLoad = async (
    data: any,
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await updateDoc(doc(db, "daily-volume-load", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily volume load:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteDailyVolumeLoad = async (
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    console.log(id)
    try {
      const docRef = await deleteDoc(doc(db, "daily-volume-load", id));
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error deleting daily volume load:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    getVolumeLoadsByInterval,
    getDailyVolumeLoad,
    addDailyVolumeLoad,
    updateDailyVolumeLoad,
    deleteDailyVolumeLoad,
    loading,
    error
  };
}
