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

export function useBodyInfo() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getBodyInfo = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'body-info'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting body info:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addBodyInfo = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, "body-info"), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error adding body info:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateBodyInfo = async (data: any, id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await updateDoc(doc(db, "body-info", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating body info:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteBodyInfo = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await deleteDoc(doc(db, "body-info", id));
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
    loading,
    error,
    getBodyInfo,
    addBodyInfo,
    updateBodyInfo,
    deleteBodyInfo
  };
}