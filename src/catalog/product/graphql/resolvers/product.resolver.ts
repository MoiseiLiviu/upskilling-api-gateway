import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductGraphqlType } from '../types/product-graphql.type';
import { CreateProductInput } from '../inputs/create-product.input';

import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../../auth/auth.guard';
import { ProductServiceClient } from '../../proto/product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CurrentUserId } from '../../../../decorators/current-user-id.decorator';

@UseGuards(AuthGuard)
@Resolver(() => ProductGraphqlType)
export class ProductResolver implements OnModuleInit {
  private productServiceClient: ProductServiceClient;

  constructor(
    @Inject('PRODUCT_PACKAGE')
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.productServiceClient =
      this.grpcClient.getService<ProductServiceClient>('ProductService');
  }

  @Mutation(() => ProductGraphqlType)
  async createProduct(
    @Args('input') createProductInput: CreateProductInput,
    @CurrentUserId() userId: number,
  ): Promise<ProductGraphqlType> {
    const createdProductPayload = await firstValueFrom(
      this.productServiceClient.createProduct({
        name: createProductInput.name,
        categoriesId: createProductInput.categoriesIds,
        unitsAvailable: createProductInput.unitsAvailable,
        price: createProductInput.price,
        imageUrl: createProductInput.imageUrl,
        userId: userId,
      }),
    );
    return ProductGraphqlType.fromModel(createdProductPayload);
  }

  @Query(() => ProductGraphqlType, { name: 'product' })
  async getById(@Args('id') id: number): Promise<ProductGraphqlType> {
    const productPayload = await firstValueFrom(
      this.productServiceClient.getById({ id }),
    );
    return ProductGraphqlType.fromModel(productPayload);
  }
}
