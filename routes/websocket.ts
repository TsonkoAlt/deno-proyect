import { Router } from '../deps.ts';

import type { customState } from '../lib/types.ts';

const router = new Router<customState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        ctx.app.state.sockets.add(socket);
        socket.addEventListener('open', () => {
            socket.send('hola cliente');
            console.log('un cliente a entrado :)');
        });
        socket.addEventListener('message', async evt => {
            const dataReq = JSON.parse(evt.data);
            const user = await ctx.state.session.get('profile');
                    const dataRes = JSON.stringify([
                        dataReq[0],
                    {
                        user: (user as Record<string, unknown>).username,
                        msg: dataReq[1],
                    },
                ]);
                if (dataReq[0] === 'chating') ctx.app.state.sendToAllSockets(dataRes, socket);
        });
        socket.addEventListener('close', () => {
            console.log('un cliente se ha ido :(');
            ctx.app.state.sockets.delete(socket);
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