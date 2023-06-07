import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';

import { CategoryGraphqlType } from '../types/category-graphql.type';
import { AuthGuard } from '../../../../auth/auth.guard';
import {
  CategoryServiceClient,
  GetAllCategoriesResponse,
} from '../../proto/category.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Resolver(() => CategoryGraphqlType)
export class CategoryResolver implements OnModuleInit {
  private categoryServiceClient: CategoryServiceClient;

  constructor(
    @Inject('CATEGORY_PACKAGE')
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.categoryServiceClient =
      this.grpcClient.getService<CategoryServiceClient>('CategoryService');
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CategoryGraphqlType)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryGraphqlType> {
    const createCategoryResponse = await firstValueFrom(
      this.categoryServiceClient.createCategory(input),
    );
    return new CategoryGraphqlType(
      createCategoryResponse.categoryId,
      input.name,
      input.description,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [CategoryGraphqlType], { name: 'categories' })
  async getAll(): Promise<CategoryGraphqlType[]> {
    const categoryPayload: GetAllCategoriesResponse = await firstValueFrom(
      this.categoryServiceClient.getAll({}),
    );
    return categoryPayload.categories.map((category) =>
      CategoryGraphqlType.fromModel(category),
    );
  }
}
