import { ref } from 'vue'
import { db } from "@/components/Utils/Firebase/firebase"
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

export function useMealOptions() {
  const loading = ref(false);
  const error = ref<any>(null);

  const getMealOptions = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'meal-options'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting meal options:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addMealOption = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
        const docRef = await addDoc(collection(db, "meal-options"), data);
        return docRef;
    } catch (e) {
        error.value = e;
        console.error("Error adding meal option:", e);
        throw e;
    } finally {
        loading.value = false;
    }
  };

  const getMealInfoByMeal = async (
    userId: string, 
    meal: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'meal-options'),
        where('userId', '==', userId),
        where('meal', '==', meal)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (e) {
      error.value = e;
      console.error("Error getting meal options:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    getMealOptions,
    addMealOption,
    getMealInfoByMeal,
    loading,
    error
  };
}
