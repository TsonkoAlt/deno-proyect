import { Router } from '../deps.ts';

import type { customState } from '../lib/types.ts'

const router = new Router<customState>();

router
.get('/about',  async ({ state }) => {
    await state.render?.('about');
})
.get('/chat',async ({ state }) => {
    await state.render?.('chat');
})
;

export default router;