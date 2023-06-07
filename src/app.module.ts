import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { CategoryModule } from './catalog/category/category.module';
import { ProductModule } from './catalog/product/product.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from "@nest-upskilling/common/dist";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    OrderModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}
