import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CartItemPayload } from '../../proto/cart.pb';

@ObjectType()
export class CartItemGraphqlType {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field()
  imageUrl: string;

  @Field(() => Int)
  price: number;

  @Field()
  name: string;

  constructor(
    productId: number,
    quantity: number,
    imageUrl: string,
    price: number,
    name: string,
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.imageUrl = imageUrl;
    this.price = price;
    this.name = name;
  }

  static fromCartItems(items: CartItemPayload[]) {
    return items.map(
      (item) =>
        new CartItemGraphqlType(
          item.productId,
          item.quantity,
          item.imageUrl,
          item.price,
          item.name,
        ),
    );
  }
}
