import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/auth.pb';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'node_modules/upskilling-protos/proto/auth.proto',
            url: configService.get<string>('AUTH_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
