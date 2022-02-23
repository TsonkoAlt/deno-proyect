import { Middleware } from '../deps.ts';

import { thisFileExist } from '../lib/helpers.ts';

export default <Middleware> (
  async function (ctx, next) {
    const { pathname } = ctx.request.url;
    const root = Deno.cwd() + '/public';

    if (await thisFileExist(root + pathname)) await ctx.send({ root });
    else await next();
  }
);
