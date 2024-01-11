export const getColorClass = (pl) => {
  if (pl < 0) {
    return 'red';
  } else {
    return 'green';
  }
};

// export const formatPLValue = (pl, symbol) => {
//   const formattedValue = pl < 0 ? `${symbol}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : pl.toLocaleString('en-US', { minimumFractionDigits: 2 });
//   return formattedValue;
// };
export const formatPLValue = (pl, symbol) => {
  const sign = pl < 0 ? '-' : '+'; // Determine the sign based on PL value
  const formattedValue = `${sign}${symbol}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  return formattedValue;
};
export const formatValue = (pl, symbol) => {
  const formattedValue = `${symbol}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  return formattedValue;
};