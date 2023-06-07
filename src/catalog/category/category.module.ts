import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryResolver } from './graphql/resolvers/category.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/category.pb';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'CATEGORY_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'node_modules/upskilling-protos/proto/category.proto',
            url: configService.get<string>('CATEGORY_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [CategoryResolver],
})
export class CategoryModule {}
