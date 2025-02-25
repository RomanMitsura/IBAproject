export const formatNumber = (number) => {
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`; // Миллионы
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`; // Тысячи
  }
  return number.toString(); // Если меньше 1000, просто показываем число
};
