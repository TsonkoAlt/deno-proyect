import type { Middleware } from '../deps.ts';
import type { customState } from '../lib/types.ts';

export default (
    async function(ctx, next) {
        ctx.state.addSocket = function(ws) {
            ctx.app.state.sockets.add(ws);
            return ctx.app.state.sockets;
        }
        ctx.state.removeSocket = function(ws) {
            return ctx.app.state.sockets?.delete(ws);
        }
        ctx.state.sendToAllSocket = function(data) {
            ctx.app.state.sockets?.forEach((ws: WebSocket) => ws.send(data));
        }
        await next();
        delete ctx.state.addSocket;
    }
) as Middleware<customState>;