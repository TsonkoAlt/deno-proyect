import { Router, ServerSentEvent } from '../deps.ts';
import { watch } from '../lib/helpers.ts';

const router = new Router();

router
  .get('/sse.js', async ({ response }) => {
    const file = `${Deno.cwd()}/dev/sse.js`;
    response.body = await Deno.readTextFile(file);
  })
  .get('/reload', (ctx) => {
    ctx.request.accepts('text/event-stream');
    const target = ctx.sendEvents();
    const event = new ServerSentEvent('refresh', 'reload');
    target.addEventListener('error', (evt) => {
      console.log('c%/reload:', 'color:red', evt);
    });
    target.addEventListener('close', () => {
      console.log('desconectado :|');
    });
    watch(() => {
      target.dispatchEvent(event);
    });
  });

export default router;
