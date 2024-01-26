import { z } from "zod";

export const RegisterAccountInputSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	confirmPassword: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	cpf: z.string(),
});

export type RegisterAccountInput = z.infer<typeof RegisterAccountInputSchema>;
