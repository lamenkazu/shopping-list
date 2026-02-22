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

  const normalized = trimmed.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);

  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
};
