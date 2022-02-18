import { Router, REDIRECT_BACK } from '../deps.ts';

import type { customState } from '../lib/types.ts'

const router = new Router<customState>();

router
.get('/', async ({ state }) => {
    await state.render?.('index');
})
.get('/about',  async ({ state }) => {
    await state.render?.('about');
})
.get('/chat', async ({ state }) => {
    await state.render?.('chat');
})
.get('/profile', async ({ state, response }) => {
    if (await state.session.has('profile')) {
        await state.render?.('/auth/profile');
    }
    else response.redirect(REDIRECT_BACK, '/');
})
;

export default router;