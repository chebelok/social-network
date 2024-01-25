import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Token = createParamDecorator((data, ctx: ExecutionContext) => {
  const auth = ctx.switchToHttp().getRequest().headers.authorization;
  const token = auth.split(' ')[1]
  return token;
})