import { z } from 'zod';

export const postSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string(),
  body: z.string()
});

export const postListSchema = z.array(postSchema);
