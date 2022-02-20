import { Router } from '../deps.ts';

import type {  CustomState, User, UserAndMsg } from '../lib/types.ts';

import { orm } from '../lib/utils.ts'

const router = new Router<CustomState>();

router
.get('/ws', async (ctx, next) => {
    try {
        const socket = ctx.upgrade()
        const profile = await ctx.state.session.get('profile') as User;
        orm.sockets.add({ username: profile.username, socket: socket });
        socket.addEventListener('open', () => {
            console.log('un cliente a entrado :)');
            orm.sendToAllSockets(
                orm.getAllUsers(profile.username),
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
                orm.pushMenssage(dataRes[1]);
                if (dataReq[0] === 'chating') {
                    orm.sendToAllSockets(
                        JSON.stringify(dataRes),
                        socket,
                        user.username,
                    );
                }
        });
        socket.addEventListener('close', () => {
            console.log('un cliente se ha ido :(');
            for (const ws of orm.sockets) {
                if (socket === ws.socket) {
                    orm.sockets.delete(ws);
                    break;
                }
            }
        });
        console.log('[sockets]: ', orm.sockets.size);        
    } catch (e) {
        console.log(e);
    } finally {
        await next();
    }
})
;

export default router;