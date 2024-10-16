import { SaleStatus } from './SideMenu.interface';

export const getStatus = (status: number | undefined) => {
  switch (status) {
    case 0: {
      return SaleStatus.SOON;
    }
    case 1: {
      return SaleStatus.AVAILABLE;
    }
    case 2: {
      return SaleStatus.FINISHED;
    }
    default:
      return null;
  }
};
