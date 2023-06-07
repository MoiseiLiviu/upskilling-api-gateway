import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductCategoryPayload } from '../../proto/product.pb';

@ObjectType()
export class ProductCategoryGraphqlType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromModel(category: ProductCategoryPayload) {
    return new ProductCategoryGraphqlType(category.id, category.name);
  }
}
