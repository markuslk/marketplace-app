import { z } from "zod";

export const UserCredentialsValidator = z.object({
	email: z.string().email(),
	password: z.string().min(6, { message: "Password must be at least 8 characters" }),
});

export type TUserCredentialsValidator = z.infer<typeof UserCredentialsValidator>;
