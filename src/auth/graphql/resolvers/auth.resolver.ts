import {
  Inject,
  OnModuleInit,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthLoginInput } from '../inputs/auth-login.input';
import { RegisterUserInput } from '../inputs/register-user.input';
import { firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from '../../proto/auth.pb';
import { AuthGuard } from '../../auth.guard';

@Resolver()
export class AuthResolver implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject('AUTH_PACKAGE')
    private readonly clientGrpc: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>('AuthService');
  }

  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Mutation(() => String)
  async login(
    @Args('input') auth: AuthLoginInput,
    @Context() context: any,
  ): Promise<string> {
    const { res } = context;
    const { accessTokenCookie, refreshTokenCookie } = await firstValueFrom(
      this.authService.loginUser({
        email: auth.email,
        password: auth.password,
      }),
    );
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return 'Login successful';
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async logout(@Context() context: any): Promise<string> {
    const { res } = context;
    const { logoutCookie } = await firstValueFrom(this.authService.logout({}));
    res.setHeader('Set-Cookie', logoutCookie);

    return 'Logout successful';
  }

  @Mutation(() => String)
  async refresh(@Context() context: any): Promise<string> {
    const { res, req } = context;
    try {
      const refreshToken = req.cookies?.Refresh;
      const { accessTokenCookie } = await firstValueFrom(
        this.authService.refresh({ refreshToken }),
      );
      res.setHeader('Set-Cookie', accessTokenCookie);
    } catch {
      throw new UnauthorizedException();
    }

    return 'Refresh successful';
  }

  @Mutation(() => String)
  async registerUser(
    @Args('input') registerUserInput: RegisterUserInput,
  ): Promise<string> {
    const { userId } = await firstValueFrom(
      this.authService.registerUser({
        email: registerUserInput.email,
        password: registerUserInput.password,
      }),
    );

    return `User created with ID: ${userId}`;
  }
}
