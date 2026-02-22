export const formatCurrencyBRL = (valueInCents: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
};

export const parseCurrencyToCents = (value: string): number | null => {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const cleaned = trimmed.replace(/\s/g, '').replace('R$', '').replace(/[^\d.,]/g, '');

  if (!cleaned) {
    return null;
  }

  const lastCommaIndex = cleaned.lastIndexOf(',');
  const lastDotIndex = cleaned.lastIndexOf('.');
  const lastSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex);

  const toDigitsOnly = (text: string) => text.replace(/[^\d]/g, '');

  if (lastSeparatorIndex === -1) {
    const integerDigits = toDigitsOnly(cleaned);

    if (!integerDigits) {
      return null;
    }

    return Number(integerDigits) * 100;
  }

  const integerPartRaw = cleaned.slice(0, lastSeparatorIndex);
  const decimalPartRaw = cleaned.slice(lastSeparatorIndex + 1);

  const integerDigits = toDigitsOnly(integerPartRaw) || '0';
  const decimalDigits = toDigitsOnly(decimalPartRaw);

  const treatAsDecimal = decimalDigits.length > 0 && decimalDigits.length <= 2;

  if (!treatAsDecimal) {
    const mergedDigits = toDigitsOnly(cleaned);

    if (!mergedDigits) {
      return null;
    }

    return Number(mergedDigits) * 100;
  }

  const cents = decimalDigits.padEnd(2, '0').slice(0, 2);
  const total = Number(integerDigits) * 100 + Number(cents);

  if (Number.isNaN(total) || total < 0) {
    return null;
  }

  return total;
};
