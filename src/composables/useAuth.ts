import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/components/Utils/Firebase/firebase'
import type { User } from 'firebase/auth'

const user = ref<User | null>(null);
const isAuthReady = ref(false);

const setupAuthListener = () => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    isAuthReady.value = true;
    console.log('Auth state initialized/changed. User:', currentUser ? currentUser.uid : 'Logged out');
  });
  
  return unsubscribe;
};

setupAuthListener();

export function useAuth() {
  return { user, isAuthReady };
}