import { Router, REDIRECT_BACK } from '../deps.ts';

import type { CustomState, User } from '../lib/types.ts'

import { orm } from '../lib/utils.ts';

const router = new Router<CustomState>();

router
.get('/', async ({ state }) => {
    await state.render?.('index');
})
.get('/about',  async ({ state }) => {
    await state.render?.('about');
})
.get('/chat', async ({ state }) => {
    const profile = await state.session.get('profile') as User;
    const chats
        = profile?.username != undefined
        ? orm.getAllMenssages(profile?.username)
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