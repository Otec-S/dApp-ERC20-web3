export const getTotalCost = ({ amount, price }: { amount: number; price: number }) => {
  return Math.round(amount * price * Math.pow(10, 18)) / Math.pow(10, 18);
};
