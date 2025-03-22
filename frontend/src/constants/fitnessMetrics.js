export const FITNESS_METRICS = [
  {
    name: "Steps",
    dataType: "com.google.step_count.delta",
    dataSourceId:
      "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    color: "#4CAF50",
    formatter: (value) => Math.round(value),
    unit: "steps",
  },
  {
    name: "Active Minutes",
    dataType: "com.google.active_minutes",
    dataSourceId:
      "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    color: "#2196F3",
    formatter: (value) => Math.round(value),
    unit: "min",
  },
  {
    name: "Calories",
    dataType: "com.google.calories.expended",
    dataSourceId:
      "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    color: "#FF5722",
    formatter: (value) => Math.round(value),
    unit: "kcal",
  },
];

export const STEP_COUNT_CONFIG = {
  name: "Steps",
  dataType: "com.google.step_count.delta",
  dataSourceId:
    "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
  color: "#4CAF50",
  formatter: (value) => Math.round(value),
  unit: "steps",
};
