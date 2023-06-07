import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CartItemGraphqlType } from './cart-item-graphql.type';
import { CartPayload } from '../../proto/cart.pb';

@ObjectType()
export class CartGraphqlType {
  @Field(() => Int)
  userId: number;

  @Field(() => [CartItemGraphqlType])
  items: CartItemGraphqlType[];

  constructor(userId: number, items: CartItemGraphqlType[]) {
    this.userId = userId;
    this.items = items;
  }

  static fromCartPayload(cart: CartPayload) {
    return new CartGraphqlType(
      cart.userId,
      CartItemGraphqlType.fromCartItems(cart.items),
    );
  }
}
