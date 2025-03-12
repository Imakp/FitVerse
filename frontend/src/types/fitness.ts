export interface FitnessDataPoint {
  intVal?: number;
  fpVal?: number;
}

export interface FitnessDataset {
  point?: Array<{
    value: FitnessDataPoint[];
  }>;
}

export interface FitnessBucket {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: FitnessDataset[];
}

export interface FitnessData {
  bucket: FitnessBucket[];
}

export interface ProcessedStepData {
  date: string;
  steps: number;
  timestamp: number;
  isToday: boolean;
}

export interface FitnessMetric {
  name: string;
  dataType: string;
  dataSourceId: string;
  color: string;
  formatter: (value: number) => number;
  unit: string;
} 