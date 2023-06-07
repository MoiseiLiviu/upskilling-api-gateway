import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(context);
    const { req } = gqlExecutionContext.getContext();
    return req.userId;
  },
);