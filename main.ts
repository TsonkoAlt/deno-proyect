import { Application } from './deps.ts';
import { ENV } from './lib/utils.ts';

import type { customState } from './lib/types.ts'

import hbsRender from './middlewares/render.ts';
import publicFiles from './middlewares/static-files.ts';
import socketMiddleware from './middlewares/SetWebsocket.ts';

import routers from './routes/routes.ts';
import reloadRouters from './routes/reload.ts';
import socketRouters from './routes/websocket.ts';

try {
    const app = new Application<customState>();

    app.state.sockets = new Set<WebSocket>();
    app.use(publicFiles);
    app.use(hbsRender);
    app.use(socketMiddleware);

    
    app.use(async ({ response }, next) => {
        await next();
        response.status = 404;
    });

    app.use(
        routers.routes(),
        reloadRouters.routes(),
        socketRouters.routes()
    );

    console.log('en vivo desde http://localhost:8080');
    await app.listen({ port: parseInt(ENV.PORT) });
} catch (e) {
    if (e.name !== 'AddrInUse') {
        console.log(e.name);
    }
}