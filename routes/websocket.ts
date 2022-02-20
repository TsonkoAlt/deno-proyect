import { Router } from '../deps.ts';

import type { customState, User, UserAndMsg } from '../lib/types.ts';

const router = new Router<customState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        const appState = ctx.app.state as customState;
        const profile = await ctx.state.session.get('profile') as User;
        appState.sockets.add({ username: profile.username, socket: socket });
        socket.addEventListener('open', () => {
            console.log('un cliente a entrado :)');
            appState.sendToAllSockets(
                appState.getAllUsers(profile.username),
            );
        });
        socket.addEventListener('message', async evt => {
            const dataReq = JSON.parse(evt.data) as string[];
            const user = await ctx.state.session.get('profile') as User;
                const dataRes: [ string, UserAndMsg ] = [
                    dataReq[0],
                    {
                        user: user.username,
                        msg: dataReq[1],
                    },
                ];
                appState.pushMenssage(dataRes[1]);
                if (dataReq[0] === 'chating') {
                    appState.sendToAllSockets(
                        JSON.stringify(dataRes),
                        socket,
                        user.username,
                    );
                }
        });
        socket.addEventListener('close', () => {
            console.log('un cliente se ha ido :(');
            for (const ws of appState.sockets) {
                if (socket === ws.socket) {
                    appState.sockets.delete(ws);
                    break;
                }
            }
        });
        console.log('[sockets]: ', appState.sockets.size);        
    } catch (e) {
        console.log(e);
    } finally {
        await next();
    }
})
;

export default router;