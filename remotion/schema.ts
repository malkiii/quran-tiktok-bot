import { z } from 'zod';

export const compositionSchema = z.object({
  croma: z.string(),
  background: z.string(),
});

export type CompositionProps = z.infer<typeof compositionSchema>;
