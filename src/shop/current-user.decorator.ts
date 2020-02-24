import { createParamDecorator } from '@nestjs/common';

import { Shop } from './shop.entity';

export const CurrentUser = createParamDecorator((data, [, , ctx]) => {
  // console.log('currentUser', ctx.req.user);
  return ctx.req.user instanceof Shop ? ctx.req.user : null;
});
