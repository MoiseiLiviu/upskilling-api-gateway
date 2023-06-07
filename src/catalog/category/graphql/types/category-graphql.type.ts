import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CategoryPayload } from '../../proto/category.pb';

@ObjectType()
export class CategoryGraphqlType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromModel(category: CategoryPayload) {
    return new CategoryGraphqlType(
      category.id,
      category.name,
      category.description,
    );
  }
}
