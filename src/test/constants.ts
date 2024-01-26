import { RegisterAccountInput } from "@/application/controller/dto/RegisterAccountInput";

export class MockRegisterAccountInput implements RegisterAccountInput {
	email = "john@doe.com";
	password = "mockpassword";
	confirmPassword = "mockpassword";
	firstName = "John";
	lastName = "Doe";
	cpf = "410.493.920-00";
}
