import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { protobufPackage } from './proto/order.pb';
import { OrderResolver } from './graphql/resolvers/order.resolver';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'ORDER_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'node_modules/upskilling-protos/proto/order.proto',
            url: configService.get<string>('ORDER_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [OrderResolver],
})
export class OrderModule {}
