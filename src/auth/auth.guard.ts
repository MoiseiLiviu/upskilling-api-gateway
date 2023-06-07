import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidateResponse } from './proto/auth.pb';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly service: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | never {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const accessTokenCookie = req?.cookies?.Authentication;
    if (!accessTokenCookie) {
      throw new UnauthorizedException();
    }

    const { status, userId }: ValidateResponse = await this.service.validate(
      accessTokenCookie,
    );
    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }
    req.userId = userId;
    return true;
  }
}
