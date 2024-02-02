import { RegisterInput } from "@/application/controller/dto/RegisterInput";
import { ResetPasswordInput } from "@/application/controller/dto/ResetPasswordInput";
import { SignInInput } from "@/application/controller/dto/SignInInput";

export class MockRegisterInput implements RegisterInput {
	email: string = "john@doe.com";
	password: string = "mockpassword";
	confirmPassword: string = "mockpassword";
	firstName: string = "John";
	lastName: string = "Doe";
	cpf: string = "410.493.920-00";
}

export class MockResetPasswordInput implements ResetPasswordInput {
	email: string = "john@doe.com";
}

export class MockSignInInput implements SignInInput {
	email: string = "john@doe.com";
	password: string = "password";
}
