export type XaxisInfo = {
  type: "category" | "datetime" | "numeric";
  unit: string;
}

export type YaxisInfo = {
  unit: string;
}

export type ChartDataset = {
  label: string;
  data: { 
    x: string | number; 
    y: number | string | null 
  }[];
  backgroundColor?: string;
  borderColor?: string;
  barThickness?: number;
}