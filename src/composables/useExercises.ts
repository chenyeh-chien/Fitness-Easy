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

export function useExercises() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getExercises = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'exercises'),
        where('userId', '==', userId),
        orderBy('bodyPart', 'asc'),
        orderBy('exercise', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting exercises:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addExercise = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
        const docRef = await addDoc(collection(db, "exercises"), data);
        return docRef;
    } catch (e) {
        error.value = e;
        console.error("Error adding exercise:", e);
        throw e;
    } finally {
        loading.value = false;
    }
  };

  const updateExercise = async (
    data: any, 
    id: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
        const docRef = await updateDoc(doc(db, "exercises", id), data);
        return docRef;
    } catch (e) {
        error.value = e;
        console.error("Error updating exercise:", e);
        throw e;
    } finally {
        loading.value = false;
    }
  };

  const deleteExercise = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
        const docRef = await deleteDoc(doc(db, "exercises", id));
        return docRef;
    } catch (e) {
        error.value = e;
        console.error("Error deleting exercise:", e);
        throw e;
    } finally {
        loading.value = false;
    }
  };

  const getExerciseInfoByExercise = async (
    userId: string, 
    exercise: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'exercises'),
        where('userId', '==', userId),
        where('exercise', '==', exercise)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting exercise info:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    getExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    getExerciseInfoByExercise,
    loading,
    error
  };
}
