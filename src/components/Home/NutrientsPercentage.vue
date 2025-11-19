<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  //plugins
} from 'chart.js'
import type { 
  ChartType,
  Plugin
} from 'chart.js'

// Register chart components
Chart.register(ArcElement, Tooltip, Legend)

const data = {
  labels: [
    'Carbohydrate',
    'Fat',
    'Protein'
  ],
  datasets: [{
    label: 'Current',
    data: [202.5, 120, 202.5],
    backgroundColor: [
      '#8980AB',
      '#80AAAB',
      '#5671B3'
    ],
    borderColor: [
      '#8980AB',
      '#80AAAB',
      '#5671B3'
    ],
    borderWidth: 0,
    hoverOffset: 4,
    cutout: '85%',
    borderRadius: 20,

  }]
};

const options = {
  layout: {
    padding: 20
  },
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  }
}

const doughnutLabelsLine: Plugin<ChartType> = {
  id: "doughnutLabelsLine",

  afterDraw(chart: Chart<ChartType>) {
    const {
      ctx,
      chartArea: { width, height }
    } = chart;

    const labels = chart.data.labels ?? [];

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      // dataset.data is usually grams, so we convert to kcal
      const gramsArr = dataset.data as Array<number | null | undefined>;

      // 🔥 P / C / F kcal conversion factors
      const kcalFactors = [4, 9, 4]; // Protein, Carb, Fat

      // Convert grams → kcal safely
      const kcalArr = gramsArr.map((g, i) => {
        if (kcalFactors[i] === undefined) return 0;

        return (g ?? 0) * kcalFactors[i] || 0
      });

      const totalKcal = kcalArr.reduce((a, b) => a + b, 0);

      meta.data.forEach((datapoint, index) => {
        const { x, y } = datapoint.tooltipPosition(false);
        if (x == null || y == null) return;

        const halfwidth = width / 2;
        const halfheight = height / 2;

        const xLine = x >= halfwidth ? x + 15 : x - 15;
        const yLine = y >= halfheight ? y + 15 : y - 15;
        const extraLine = x >= halfwidth ? 15 : -15;

        // Resolve color (safe)
        let color: string | undefined;
        if (Array.isArray(dataset.borderColor)) {
          color = dataset.borderColor[index] as string | undefined;
        } else if (typeof dataset.borderColor === "string") {
          color = dataset.borderColor;
        } else {
          color = "#666";
        }

        // Draw connector line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xLine, yLine);
        ctx.lineTo(xLine + extraLine, yLine);
        ctx.strokeStyle = color ?? "#666";
        ctx.stroke();

        // Resolve label
        const rawLabel = labels[index];
        const label =
          typeof rawLabel === "string"
            ? rawLabel
            : typeof rawLabel === "number"
            ? rawLabel.toString()
            : "";

        // 🔥 kcal value for this nutrient
        const kcal = kcalArr[index] ?? 0;

        // 🔥 percentage based on kcal
        const percentage =
          totalKcal > 0 ? ((kcal / totalKcal) * 100).toFixed(1) + "%" : "0%";

        // Final display: "Protein 28.3%"
        const displayText = `${label} ${percentage}`;

        ctx.font = "12px Arial";
        ctx.textAlign = x >= halfwidth ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color ?? "#666";

        const offset = x >= halfwidth ? 5 : -5;

        ctx.fillText(displayText, xLine + extraLine + offset, yLine);
      });
    });
  },
};

const plugins = [doughnutLabelsLine]
</script>

<template>
  <Doughnut
    :options="options"
    :data="data"
    :plugins="plugins"/>
</template>