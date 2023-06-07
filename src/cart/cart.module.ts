import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartResolver } from './graphql/resolvers/cart.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/cart.pb';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from "@nest-upskilling/common/dist";

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'CART_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'node_modules/upskilling-protos/proto/cart.proto',
            url: configService.get<string>('CART_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [CartResolver],
})
export class CartModule {}
