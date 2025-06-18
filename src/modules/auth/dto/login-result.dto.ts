import { Expose } from 'class-transformer';

export class LoginResult {
  constructor(access_token: string) {
    this.access_token = access_token;
  }

  @Expose()
  readonly access_token: string;
}
