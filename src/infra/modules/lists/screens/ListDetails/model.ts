import type { CreateShoppingItemDTO } from '@core/dto/item.dto';
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
});

export type ItemFormData = z.infer<typeof itemSchema>;

export const defaultValues: ItemFormData = {
  title: '',
  quantity: '',
  unit: '',
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
    userId,
  };
};

