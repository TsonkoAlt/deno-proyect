import { Handlebars, HandlebarsConfig, Middleware } from '../deps.ts';
import { helpers } from '../lib/helpers.ts';
import type { CustomState, User } from '../lib/types.ts';

const isDev = Deno.env.get('DEV') === 'true';

export const renderConfig: HandlebarsConfig = {
  baseDir: 'views',
  extname: '.hbs',
  layoutsDir: 'layouts/',
  partialsDir: 'partials/',
  cachePartials: !isDev,
  defaultLayout: 'main',
  helpers,
  compilerOptions: undefined,
};

const handle = new Handlebars(renderConfig);

const navs = {
  normals: [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/chat', name: 'chat' },
  ],
  register: [
    { path: '/logout', name: 'logout' },
    { path: '/profile', name: 'profile' },
  ],
  no_register: [
    { path: '/signup', name: 'signup' },
    { path: '/login', name: 'login' },
  ],
};
export default <Middleware<CustomState>> (
  async function ({ response, state, app, request }, next) {
    const { menssageRender: menssage } = app.state;
    state.render = async (
      filename: string,
      data?: Record<string, unknown> | undefined,
    ) => {
      try {
        const { pathname } = request.url;
        const profile = <User> await state.session.get('profile');
        response.body = await handle.renderView(filename, {
          isDev,
          pathname,
          menssage,
          navs,
          profile,
          ...data,
        });
      } catch (err) {
        console.log(err);
        response.body = err.name;
      }
    };
    await next();
    delete state.render;
  }
);
