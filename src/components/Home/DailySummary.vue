<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import DigitScroller from '../Utils/transitions/DigitScroller.vue'
// import NutrientsPercentage from './NutrientsPercentage.vue'
import RemainNutrients from './RemainNutrients.vue'
import { watch, ref, onMounted } from 'vue';

const { user, isAuthReady } = useAuth();
const { getDailyTargetsByDate } = useDailyTarget();
const currentDate = ref(new Date().toISOString().slice(0, 10))
const dailyTarget = ref({
  protein: 0,
  carbohydrate: 0,
  fat: 0,
  total: 0
});

onMounted(() => {
  if (isAuthReady.value) {
    checkUserDailyTarget()
  }
})

watch(
  isAuthReady,
  () => {
    checkUserDailyTarget();
  }
)

async function checkUserDailyTarget() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  const querySnapshot = 
    await getDailyTargetsByDate(user.value.uid, currentDate.value);
  
  if (querySnapshot.empty) {
    console.log("No targets found for this user.");
    return;
  }

  const data = querySnapshot.docs[0]!.data();

  dailyTarget.value = {
    protein: data.protein,
    carbohydrate: data.carbohydrate,
    fat: data.fat,
    total: data.protein * 4 + data.carbohydrate * 4 + data.fat * 9
  };

  console.log(dailyTarget.value)
}

</script>

<template>
  <div class="flex flex-wrap gap-10">
    <div>
      <DigitScroller
        :data="dailyTarget.total"
        :transitionDuration="2"
        :size="'2xl'"
        :font-weight="700"
        :color="'var(--sidebar-link-color)'"
        :show-unit="true"
        :unit="'kcal'"/>
    </div>
    <div class="w-full">
      <RemainNutrients 
        :protein="dailyTarget.protein"
        :carbohydrate="dailyTarget.carbohydrate"
        :fat="dailyTarget.fat"
        />
    </div>
    <!-- 顯示在當天應該攝取的比例比較適合 -->
    <!-- 
    <div class="w-full flex justify-center md:w-auto">
      <div class="w-full max-w-100 h-30 md:w-100">
        <NutrientsPercentage />
      </div>
    </div>
    -->
  </div>
</template>