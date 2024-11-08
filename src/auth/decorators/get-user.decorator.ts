import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
