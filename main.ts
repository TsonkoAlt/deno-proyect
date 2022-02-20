import { Application, Status, Session, CookieStore } from './deps.ts';

import type { CustomState } from './lib/types.ts'

import hbsRender from './middlewares/render.ts';
import publicFiles from './middlewares/static-files.ts';

import routers from './routes/routes.ts';
import authRouters from './routes/auth.ts';
import reloadRouters from './routes/reload.ts';
import socketRouters from './routes/websocket.ts';

try {
    const app = new Application<CustomState>();
    const store = new CookieStore(Deno.env.get('SECRET_KEY'))
    const session = new Session(store);
    const hostname = Deno.env.get('HOST') ?? 'localhost';
    const port = parseInt(Deno.env.get('PORT') ?? '8080');

    app.use(session.initMiddleware());
    app.use(publicFiles);
    app.use(hbsRender);

    app.use(async ({ response, request }, next) => {
        const { pathname } = request.url;
        if (pathname.length > 1 && pathname.endsWith('/')) {
            console.log('hola');
            response.status = Status.MovedPermanently;
            response.redirect(pathname.replace(/\/$/, ''))
        }
        await next();
    });

    app.use(
        routers.routes(),
        authRouters.routes(),
        reloadRouters.routes(),
        socketRouters.routes(),
    );
    
    app.use(async ({ response, state }, next) => {
        response.status = Status.NotFound;
        await state.render?.('404');
        await next();
    });
    
    console.log(`en vivo desde http://${hostname}:${port}`);
    await app.listen({
    	hostname,
    	port,
    });
} catch (e) {
    if (e.name !== 'AddrInUse') {
        console.log(e.name);
    }
}
