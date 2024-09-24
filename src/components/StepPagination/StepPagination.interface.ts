export enum StepStatus {
  INITIAL = 'initial',
  CURRENT = 'current',
  COMPLETED = 'completed',
}

export interface IStep {
  value: number;
  status: StepStatus;
}
