import { z } from "zod";

export const RegisterInputSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	confirmPassword: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	cpf: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
