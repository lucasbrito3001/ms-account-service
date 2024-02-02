import { z } from "zod";

export const ResetPasswordInputSchema = z.object({
	email: z.string().email(),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;
