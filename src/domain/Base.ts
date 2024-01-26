import { cpf } from "cpf-cnpj-validator";

export class DomainBase {
	static cpfValidator(document: string): boolean {
		return cpf.isValid(document);
	}
}
