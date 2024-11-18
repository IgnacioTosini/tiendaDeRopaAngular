export class RestorePasswordData {
  email: string;
  code: string;
  password: string;

  constructor(email: string, code: string, password: string) {
    this.email = email;
    this.code = code;
    this.password = password;
  }
}
