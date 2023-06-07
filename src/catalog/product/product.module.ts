import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductResolver } from './graphql/resolvers/product.resolver';
import { AuthModule } from '../../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/product.pb';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'node_modules/upskilling-protos/proto/product.proto',
            url: configService.get<string>('PRODUCT_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [ProductResolver],
})
export class ProductModule {}
