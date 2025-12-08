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

export function useDailyWorkouts() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getDailyWorkouts = async (
    userId: string,
    date: Date
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const formattedDate = formatDateStr(date, false);

      const q = query(
        collection(db, 'daily-workouts'),
        where('userId', '==', userId),
        where('date', '==', formattedDate),
        orderBy('bodyPart', 'desc'),
        orderBy('exercise', 'desc'),
        orderBy('weight', 'desc'),
        orderBy('reps', 'desc'),
        orderBy('sets', 'desc'),
        orderBy('setTime', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting daily workouts:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getLatestWeight = async (
    userId: string,
    date: Date,
    bodyPart: string,
    exercise: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const formattedDate = formatDateStr(date, false);

      const q = query(
        collection(db, 'daily-workouts'),
        where('userId', '==', userId),
        where('date', '<', formattedDate),
        where('bodyPart', '==', bodyPart),
        where('exercise', '==', exercise),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting latest weight:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addDailyWorkout = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, "daily-workouts"), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error adding daily workout:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateDailyWorkout = async (
    data: any,
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await updateDoc(doc(db, "daily-workouts", id), data);
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error updating daily workout:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteDailyWorkout = async (
    id: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const docRef = await deleteDoc(doc(db, "daily-workouts", id));
      return docRef;
    } catch (e) {
      error.value = e;
      console.error("Error deleting daily workout:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    getDailyWorkouts,
    getLatestWeight,
    addDailyWorkout,
    updateDailyWorkout,
    deleteDailyWorkout,
    loading,
    error
  };
}
