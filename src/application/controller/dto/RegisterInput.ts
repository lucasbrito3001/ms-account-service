import { z } from "zod";

export const RegisterInputSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	confirmPassword: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	cpf: z
		.string()
		.transform((value) => value.replace(/[^\w]/g, ""))
		.refine(
			(value) => value.length === 11,
			"The cpf format is invalid, check and try again"
		),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
