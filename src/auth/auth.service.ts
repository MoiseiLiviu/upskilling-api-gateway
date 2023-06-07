import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, ValidateResponse } from './proto/auth.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private svc: AuthServiceClient;

  @Inject('AUTH_PACKAGE')
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>('AuthService');
  }

  public async validate(token: string): Promise<ValidateResponse> {
    return firstValueFrom(this.svc.validate({ token }));
  }
}
