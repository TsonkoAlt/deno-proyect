import { Handlebars, HandlebarsConfig, Middleware } from '../deps.ts';
import { helpers } from '../lib/helpers.ts';

const isDev = Deno.env.get('DEV') === 'true';

export const renderConfig: HandlebarsConfig = {
    baseDir: 'views',
    extname: '.hbs',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    cachePartials: !isDev,
    defaultLayout: 'main',
    helpers,
    compilerOptions: undefined
};

const handle = new Handlebars(renderConfig);

export default (
    async function ({ response, state, request }, next) {
        state.render = async (filename: string, data?: Record<string, unknown> | undefined) => {
            const { pathname } = request.url;
            response.body = await handle.renderView(filename, { ...data, isDev, pathname });
        }
        await next();
        delete state.render;
    }
) as Middleware;