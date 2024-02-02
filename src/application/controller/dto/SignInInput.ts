import { z } from "zod";

export const SignInInputSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type SignInInput = z.infer<typeof SignInInputSchema>;
