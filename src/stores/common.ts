import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDatetimeStore = defineStore('datetime', () => {
  const currTime = ref(new Date());
  const lastProcessedDate = ref('');
  let timer: ReturnType<typeof setTimeout> | null = null;

  function executeAutoUpdate(targetDate: Date, dateStr: string) {
    currTime.value = targetDate;
    lastProcessedDate.value = dateStr;
    console.log(`[系統] 已執行 ${dateStr} 06:00 的自動更新`);
  }

  function changeTime(time: Date) {
    currTime.value = time;
    lastProcessedDate.value = new Date().toLocaleDateString('en-CA');
  }

  function setupNextTick() {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA');

    let targetTime = 
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);

    if (now >= targetTime) {
      if (lastProcessedDate.value !== todayStr) {
        executeAutoUpdate(now, todayStr);
      }

      targetTime.setDate(targetTime.getDate() + 1);
    }

    const msToTarget = targetTime.getTime() - now.getTime();

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const triggerDateStr = new Date().toLocaleDateString('en-CA');
      executeAutoUpdate(new Date(), triggerDateStr);
      setupNextTick(); // 遞迴設定下一輪
    }, msToTarget);
  }

  function init() {
    setupNextTick();
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        setupNextTick();
      }
    });
  }

  return { 
    currTime, 
    changeTime, 
    lastProcessedDate,
    init }
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