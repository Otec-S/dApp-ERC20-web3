import { HistoryIcon, MyOfferIcon } from '@assets/icons';
import { routes } from '@shared/constants';

export const tabs = [
  { name: 'Create offer', route: routes.createOffer, icon: null },
  { name: 'My offers', route: routes.myOffers, icon: <MyOfferIcon /> },
  { name: 'History', route: routes.history, icon: <HistoryIcon /> },
];
