import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDatetimeStore = defineStore('datetime', () => {
  const currTime = ref(new Date());

  function changeTime(time: Date) {
    currTime.value = time;
  }

  return { currTime, changeTime }
}, {
  persist: {
    // Custom serializer to handle Date objects
    serializer: {
      serialize: (state: any) => JSON.stringify(state),
      deserialize: (value: string) => {
        const data = JSON.parse(value)
        if (data.currTime) {
          data.currTime = new Date(data.currTime) // Convert back to Object
        }
        return data
      }
    }
  }
} as any)