export enum StepStatus {
  DISABLED = 'disabled',
  DARK = 'dark',
  LIGHT = 'light',
  COMPLETED = 'completed',
}

export interface Step {
  value: number;
  status: StepStatus;
}
