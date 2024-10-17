export const getFormattedPrice = (price: number) => {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 3,
  });

  return USDollar.format(price);
};
