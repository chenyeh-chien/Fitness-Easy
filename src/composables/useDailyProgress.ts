import { ref } from "vue";
import { db } from "@/components/Utils/Firebase/firebase";
import { 
  collection, 
  query, 
  where, 
  doc,
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

export function useDailyProgress() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getDailyProgress = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'daily-progress'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily progress:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addDailyProgress = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, "daily-progress"), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error adding daily progress:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateDailyProgress = async (data: any, id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await updateDoc(doc(db, "daily-progress", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily progress:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteDailyProgress = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await deleteDoc(doc(db, "daily-progress", id));
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error deleting daily progress:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    getDailyProgress,
    addDailyProgress,
    updateDailyProgress,
    deleteDailyProgress
  };
}