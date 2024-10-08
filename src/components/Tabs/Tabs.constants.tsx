import { HistoryIcon, MyOfferIcon } from '@assets/icons';
import { ROUTES } from '@shared/constants';

export const tabs = [
  { name: 'Create offer', route: ROUTES.CREATE_OFFER, icon: null },
  { name: 'My offers', route: ROUTES.MY_OFFERS, icon: <MyOfferIcon /> },
  { name: 'History', route: ROUTES.HISTORY, icon: <HistoryIcon /> },
];
