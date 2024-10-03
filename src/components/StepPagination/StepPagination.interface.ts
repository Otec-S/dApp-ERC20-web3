export enum StepStatus {
  DISABLED = 'disabled',
  CURRENT = 'current',
  COMPLETED = 'completed',
}

export interface Step {
  value: number;
  status: StepStatus;
}