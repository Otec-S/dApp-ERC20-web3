export enum StepStatus {
  DISABLED = 'disabled',
  DARK = 'dark',
  LIGHT = 'light',
  COMPLETED = 'completed',
}

export interface IStep {
  value: number;
  status: StepStatus;
}
