import { RegisterAccountInput } from "@/application/controller/dto/RegisterAccountInput";

export interface RegisterAccountPort {
	execute(input: RegisterAccountInput): Promise<RegisterAccountOutput>;
}

export class RegisterAccountOutput {
	constructor(public accountId: string) {}
}
