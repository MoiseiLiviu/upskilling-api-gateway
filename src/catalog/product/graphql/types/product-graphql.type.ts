import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductPayload } from '../../proto/product.pb';
import { ProductCategoryGraphqlType } from './product-category-graphql.type';

@ObjectType()
export class ProductGraphqlType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  unitsAvailable: number;

  @Field()
  imageUrl: string;

  @Field(() => [ProductCategoryGraphqlType], { nullable: true })
  categories: ProductCategoryGraphqlType[];

  constructor(
    id: number,
    name: string,
    price: number,
    unitsAvailable: number,
    imageUrl: string,
    categories: ProductCategoryGraphqlType[],
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.unitsAvailable = unitsAvailable;
    this.imageUrl = imageUrl;
    this.categories = categories;
  }

  static fromModel(product: ProductPayload) {
    return new ProductGraphqlType(
      product.id,
      product.name,
      product.price,
      product.unitsAvailable,
      product.imageUrl,
      product.categories.map((category) =>
        ProductCategoryGraphqlType.fromModel(category),
      ),
    );
  }
}
