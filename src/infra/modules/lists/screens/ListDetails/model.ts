import type { CreateShoppingItemDTO } from '@core/dto/item.dto';
import { parseCurrencyToCents } from '@infra/shared/utils';
import { z } from 'zod';

export const itemSchema = z.object({
  title: z.string().trim().min(1, 'O nome do item é obrigatório.'),
  quantity: z
    .string()
    .trim()
    .optional()
    .refine(value => {
      if (!value) {
        return true;
      }

      const normalized = value.replace(',', '.');
      return !Number.isNaN(Number(normalized));
    }, 'A quantidade deve ser um número válido.'),
  unit: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .optional()
    .refine(value => {
      if (!value) {
        return true;
      }

      return parseCurrencyToCents(value) !== null;
    }, 'O preço deve ser um valor monetário válido.'),
});

export type ItemFormData = z.infer<typeof itemSchema>;

export const defaultValues: ItemFormData = {
  title: '',
  quantity: '',
  unit: '',
  price: '',
};

export const toCreateDTO = (
  data: ItemFormData,
  listId: string,
  userId: string
): CreateShoppingItemDTO => {
  const normalizedQuantity = data.quantity?.trim() ? Number(data.quantity.replace(',', '.')) : null;

  return {
    listId,
    title: data.title.trim(),
    quantity: normalizedQuantity,
    unit: data.unit?.trim() ? data.unit.trim() : null,
    priceCents: data.price?.trim() ? parseCurrencyToCents(data.price) : null,
    userId,
  };
};
