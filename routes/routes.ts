import { Router, REDIRECT_BACK } from '../deps.ts';

import type { customState, User } from '../lib/types.ts'

const router = new Router<customState>();

router
.get('/', async ({ state }) => {
    await state.render?.('index');
})
.get('/about',  async ({ state }) => {
    await state.render?.('about');
})
.get('/chat', async ({ state, app }) => {
    const profile = await state.session.get('profile') as User;
    const chats
        = profile?.username != undefined
        ? app.state.getAllMenssages(profile?.username)
        : undefined
    ;
    await state.render?.('chat', {
        chats,
    });
})
.get('/profile', async ({ state, response }) => {
    if (await state.session.has('profile')) {
        await state.render?.('/auth/profile');
    }
    else response.redirect(REDIRECT_BACK, '/');
})
;

export default router;