import { Router } from '../deps.ts';

import type { customState, User } from '../lib/types.ts';

const router = new Router<customState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        const profile = await ctx.state.session.get('profile') as User;
        ctx.app.state.sockets.add({username: profile.username, socket: socket});
        socket.addEventListener('open', () => {
            console.log('un cliente a entrado :)');
            socket.send(ctx.app.state.getAllMenssages(profile));
        });
        socket.addEventListener('message', async evt => {
            const dataReq = JSON.parse(evt.data) as string[];
            const user = await ctx.state.session.get('profile') as User;
                const dataRes = [
                    dataReq[0],
                    {
                        user: user.username,
                        msg: dataReq[1],
                    },
                ];
                ctx.app.state.pushMenssage(dataRes[1]);
                if (dataReq[0] === 'chating') {
                    ctx.app.state.sendToAllSockets(JSON.stringify(dataRes), socket, user.username);
                }
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