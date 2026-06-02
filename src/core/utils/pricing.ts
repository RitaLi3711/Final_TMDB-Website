export const calculatePrice = (releaseDate: string) => {
  if (!releaseDate) return 4.99;

  const currentYear = new Date().getFullYear();
  const releaseYear = new Date(releaseDate).getFullYear();
  const yearsOld = currentYear - releaseYear;

  const price = 19.99 - yearsOld;
  const roundedPrice = Math.max(price, 4.99);
  return Math.round(roundedPrice * 100) / 100;
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
