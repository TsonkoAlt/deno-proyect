import { Router } from '../deps.ts';

import type { customState } from '../lib/types.ts';

const router = new Router<customState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        ctx.state.sockets.add(socket);
        socket.addEventListener('open', () => {
            socket.send('hola cliente');
            console.log('un cliente a entrado :)');
        });
        socket.addEventListener('message', evt => {
            const data = JSON.parse(evt.data);
            if (data[0] === 'chating') ctx.state.sendToAllSockets(evt.data, socket);
        });
        socket.addEventListener('close', () => {
            console.log('un cliente se ha ido :(');
            ctx.state.sockets.delete(socket);
        });
        console.log('[sockets]: ', ctx.state.sockets.size);        
    } catch (e) {
        console.log(e);
    } finally {
        await next();
    }
})
;

export default router;