import { RegisterInput } from "@/application/controller/dto/RegisterInput";

export class MockRegisterInput implements RegisterInput {
	email = "john@doe.com";
	password = "mockpassword";
	confirmPassword = "mockpassword";
	firstName = "John";
	lastName = "Doe";
	cpf = "410.493.920-00";
}
