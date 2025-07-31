import { z } from 'zod'

export const userNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .trim()
    .refine((name) => name.length > 0, {
      message: 'Name cannot be just whitespace',
    })
    .refine((name) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name), {
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),
})

export type UserNameFormData = z.infer<typeof userNameSchema>