import { Router } from '../deps.ts';

import type { customState } from '../lib/types.ts';

const router = new Router<customState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        const sockets = ctx.state.addSocket?.(socket);
        socket.addEventListener('open', () => {
            socket.send('hola cliente');
            console.log('un cliente a entrado :)');
        });
        socket.addEventListener('message', evt => {
            const data = JSON.parse(evt.data);
            if (data?.type === 'chating') ctx.state.sendToAllSocket?.(evt.data);
        });
        socket.addEventListener('close', () => {
            ctx.state?.removeSocket?.(socket);
            console.log('un cliente se ha ido :(');
        });

        console.log('[socket]: ', sockets?.size);        
    } catch (e) {
        console.log(e);
    } finally {
        await next();
    }
})
;

export default router;