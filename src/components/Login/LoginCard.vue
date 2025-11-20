<script setup lang="ts">
import { clsx } from "clsx";
import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth"
import { auth } from "@/components/Utils/Firebase/firebase"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { UserInfo } from "@/types/common";

function serializeUserData(user: User): UserInfo {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
    provider: user.providerData?.[0]?.providerId,
    emailVerified: user.emailVerified,
  }
}

async function handleSigninToGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const serializedData = serializeUserData(user);
  
  localStorage.setItem("userInfo", JSON.stringify(serializedData));
}

</script>

<template>
  <div 
    :class="clsx(
      'w-80 h-100 bg-(--login-bg) border rounded-lg p-4',
      'border-(--login-border-color) flex justify-center items-center'
    )">
    <button 
      :class="clsx(
        'text-white hover:cursor-pointer w-full bg-[#332E3B]',
        'border rounded-lg border-none py-1.5 text-sm',
        'flex justify-center items-center gap-2'
      )"
      @click="handleSigninToGoogle">
      <div class="text-xs flex justify-center items-center">
        <FontAwesomeIcon icon="fa-brands fa-google"/>
      </div>
      <div>
        <span>Continue with Google</span>
      </div>
    </button>
  </div>
</template>