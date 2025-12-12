<script setup lang="ts">
import { toRefs, ref, computed, nextTick, watch } from 'vue'
import clsx from 'clsx';
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, LineElement, ArcElement,
  CategoryScale, LinearScale, PointElement,
  TimeScale, Filler
} from "chart.js"
import type { 
  ChartData,
  ChartOptions 
} from "chart.js"
import type { 
  XaxisInfo,
  YaxisInfo,
  ChartDataset,
} from "@/types";
import { Bar, Line, Pie, Doughnut } from "vue-chartjs";
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { 
  formatDateStr,
  getCSSVariable,
  getDataColorSet,
  hexToRgba,
} from "@/components/Utils/utilFunctions";

interface Props {
  chartType: "line" | "bar" | "area";
  title: string;
  xaxisInfo: XaxisInfo;
  yaxisInfo: YaxisInfo;
  dataset: ChartDataset[];
  roundTo: number;
}

interface Emits {
  (e: "changeTimeInterval", start: Date, end: Date): void;
}

const props = defineProps<Props>();
const { 
  chartType, 
  title, 
  xaxisInfo, 
  yaxisInfo, 
  dataset, 
  roundTo
} = toRefs(props);
const emits = defineEmits<Emits>();
const CHART_MAP = {
  "bar": Bar,
  "line": Line,
  "area": Line,
}
const colors = getDataColorSet();
const showChart = ref(true);
const transformedData = ref<ChartData<any>>({
  labels: [],
  datasets: [],
});
const options = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    zoom: {
      zoom: {
        drag: {
          enabled: true,
          backgroundColor: getCSSVariable("--chart-zoom-bg"),
          borderColor: getCSSVariable("--chart-zoom-border-color"),
          borderWidth: 1,
          drawTime: 'afterDatasetsDraw'
        },
        mode: 'x',
        onZoomComplete({ chart }) {
          const xScale = chart.scales.x as any;
          const startTime = xScale.min;
          const endTime = xScale.max;
          emits("changeTimeInterval", new Date(startTime), new Date(endTime));
        },
      },
    },
    legend: {
        display: false,
    },
    tooltip: {
      enabled: false, // disable default tooltip
      external: (context) => {
        const { chart, tooltip } = context;
        const { dataPoints } = tooltip;
        
        if (!dataPoints || dataPoints.length === 0) {
            return;
        }

        const point = dataPoints[0] as any;
        const dataset = chart.data.datasets[point.datasetIndex] as any;
        const dataItem = dataset.data[point.dataIndex] as any;

        const cmdID = dataItem?.cmd_id;
        const title = dataset.label;
        const arrangedTitle = cmdID !== undefined ? `${title} (${cmdID})` : title;
        const value = dataItem?.y ?? point.raw;
        const time = dataItem?.x;
        const unit = yaxisInfo.value.unit !== "" ? ` ${yaxisInfo.value.unit}` : "";
        const arrangedValue = value != null ? `${value.toFixed(roundTo.value)}${unit}` : "";
        let tooltipEl = document.getElementById("chartjs-custom-tooltip");
        
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-custom-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all 0.1s ease';
            document.body.appendChild(tooltipEl);
        }

        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
        }
        
        if (tooltip.body) {
            tooltipEl.innerHTML = `
                <div class="chart-tooltips">
                    <div class="chart-tooltips__time">
                        <span>${formatDateStr(time, true, true)}</span>
                    </div>
                    <div class="chart-tooltips__content">
                        <div class="chart-tooltips__content__repr-color">
                            <div style="background: ${dataset.borderColor};"></div>
                        </div>
                        <div>
                            <span>${arrangedTitle}:</span>
                        </div>
                        <div class="chart-tooltips__content__value">
                            <span>${arrangedValue}</span>
                        </div>
                    </div>
                </div>`;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        const canvasLeft = position.left + window.scrollX;
        const canvasTop = position.top + window.scrollY;

        let tooltipX = canvasLeft + tooltip.caretX;
        let tooltipY = canvasTop + tooltip.caretY;

        // 取得 tooltip 寬高（需要先 render 內容後才能取）
        const tooltipWidth = tooltipEl.offsetWidth;
        const tooltipHeight = tooltipEl.offsetHeight;

        // 取得 window 的寬高
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 檢查如果超出右邊界
        if (tooltipX + tooltipWidth > windowWidth) {
            tooltipX = tooltipX - tooltipWidth - 10; // 換到左邊顯示，並預留10px間距
        }

        // 檢查如果超出下邊界
        if (tooltipY + tooltipHeight > windowHeight) {
            tooltipY = tooltipY - tooltipHeight - 10; // 換到上面顯示，並預留10px間距
        }

        tooltipEl.style.opacity = "1";
        tooltipEl.style.left = tooltipX + 'px';
        tooltipEl.style.top = tooltipY + 'px';
      }
    },
    title: {
        display: false,
        text: `${title.value}`,
        color: getCSSVariable("--chart-title-color"),
        font: {
            size: 19,
            weight: "normal",
        },
        padding: {
            top: 10,
            bottom: 20,
        }
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        tooltipFormat: "yyyy-MM-dd HH:mm:ss",
        displayFormats: {
          minute: "HH:mm",
          hour: "MM-dd HH:mm",
        },
      },
      ticks: {
        color: getCSSVariable("--chart-xaxis-label-color"),
        autoSkip: false,
        font: {
          size: 11,
        },
      },
      title: {
        display: true,
        text: xaxisInfo.value.unit,
        color: getCSSVariable("--chart-xaxis-title-color"),
        font: {
          size: 10,
        },
      },
      grid: {
        display: false,
        color: getCSSVariable("--chart-setting-bg"),
      },
      border: {
        display: false,
      }
    },
    y: {
      ticks: {
        color: getCSSVariable("--chart-yaxis-label-color"),
        callback: (val) => +val != null ? (+val).toFixed(roundTo.value) : val,
        font: {
          size: 11,
        },
      },
      title: {
        display: true,
        text: yaxisInfo.value.unit,
        color: getCSSVariable("--chart-yaxis-title-color"),
        font: {
          size: 10,
        },
      },
      grid: {
        color: getCSSVariable("--chart-grid-color"),
      },
      border: {
        display: false,
      }
    }
  },
  datasets: {
    bar: {
      grouped: false
    }
  }
});

const chartComponent = computed(() => CHART_MAP[chartType.value] || Bar);

ChartJS.register(
  Title, Tooltip, Legend,
  BarElement, LineElement, ArcElement,
  CategoryScale, LinearScale, PointElement,
  TimeScale, zoomPlugin, Filler
)

const makeVerticalGradient = (
    ctx: CanvasRenderingContext2D, 
    area: { top: number; bottom: number }, 
    color: string
) => {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  g.addColorStop(0, hexToRgba(color, 0.4));
  g.addColorStop(1, hexToRgba(color, 0.0));
  return g;
}

watch(
  dataset,
  async (newValue) => {
    if (options.value.plugins?.title) {
      // options.value.plugins.title.text = `${title.value} (${datasetCnt.value})`;

      showChart.value = false;
      await nextTick();
      showChart.value = true;
    }

    transformedData.value = {
      datasets: newValue.map((data, index) => {
        const color = colors[index] ?? "#4bc0c0";
        const isArea = chartType.value === "area";

        return {
          ...data,
          backgroundColor: isArea 
            ? (ctx: any) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return null;
                      
              return makeVerticalGradient(c, chartArea, color);
            }
            : color,
          borderColor: colors[index],
          borderWidth: 3,
          pointBackgroundColor: colors[index],
          pointRadius: 0,
          barThickness: 4,
          fill: chartType.value === "area",
        }
      })
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div 
    :class="clsx(
      'flex flex-col gap-4 w-100 h-55',
      'pt-5 pr-12'
    )">
    <component
      v-if="showChart"
      ref="chartRef"
      :is="chartComponent"
      :data="transformedData" 
      :options="options"/>
  </div>
</template>