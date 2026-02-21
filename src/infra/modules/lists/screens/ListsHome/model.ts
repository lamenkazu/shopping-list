import type { CreateShoppingListDTO } from '@core/dto/list.dto';
import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().trim().min(1, 'List name is required.'),
});

export type CreateListFormData = z.infer<typeof createListSchema>;

export const defaultValues: CreateListFormData = {
  name: '',
};

export const toDTO = (data: CreateListFormData): CreateShoppingListDTO => {
  return {
    name: data.name.trim(),
  };
};
