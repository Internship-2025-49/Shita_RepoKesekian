import { z } from "zod"

export const personSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    address: z.string().min(3),
    phone: z.string().min(10),
})

export type userForm = z.infer<typeof personSchema>;
