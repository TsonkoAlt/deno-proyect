import { Application, Status, Session, CookieStore } from './deps.ts';
import { state } from './lib/utils.ts';

import type { customState } from './lib/types.ts'

import hbsRender from './middlewares/render.ts';
import publicFiles from './middlewares/static-files.ts';

import routers from './routes/routes.ts';
import reloadRouters from './routes/reload.ts';
import socketRouters from './routes/websocket.ts';

try {
    const app = new Application<customState>({ state });
    const store = new CookieStore(Deno.env.get('SECRET_KEY'))
    const session = new Session(store);

    app.use(session.initMiddleware());
    app.use(publicFiles);
    app.use(hbsRender);

    app.use(
        routers.routes(),
        reloadRouters.routes(),
        socketRouters.routes()
    );
    
    app.use(async ({ response, request }, next) => {
        const { pathname } = request.url;
        if (pathname.length > 1 && pathname.endsWith('/')) {
            response.status = Status.MovedPermanently;
            response.redirect(pathname.replace(/\/$/, ''))
        }
        await next();
    });
    
    app.use(async ({ response, state }, next) => {
        response.status = Status.NotFound;
        await state.render?.('404');
        await next();
    });
    
    console.log('en vivo desde http://localhost:8080');
    await app.listen({ port: parseInt(Deno.env.get('PORT') ?? '8000') });
} catch (e) {
    if (e.name !== 'AddrInUse') {
        console.log(e.name);
    }
}