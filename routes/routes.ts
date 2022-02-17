import { Router, bcrypt, REDIRECT_BACK } from '../deps.ts';

import type { customState } from '../lib/types.ts'
import { userValidate } from '../lib/utils.ts';

const router = new Router<customState>();

router
.get('/', async ({ state }) => {
    await state.render?.('index');
})
.get('/signup', async ({ state, app, response }) => {
    if (await state.session.has('profile')) response.redirect(REDIRECT_BACK, '/');
    else {
        console.log(state.menssageRender);
        await state.render?.('auth/signup');
        app.state.menssageRender = undefined;
    }
})
.post('/signup',
    async ({ request, response, app, state }) => {
        const params: URLSearchParams = await request.body().value;
        const user = {
            username: params.get('username'),
            password: params.get('password')
        };
        app.state.menssageRender = userValidate(user);
        if (app.state.menssageRender !== undefined) response.redirect('/signup');
        else {
            user.password = await bcrypt.hash(
                user.password ?? '',
                await bcrypt.genSalt(8)
            );
            await state.session.set('profile', user);
            response.redirect('/profile');
        }
    }
)
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
.get('/logout', async ({ state, response }) => {
    await state.session.deleteSession();
    response.redirect('/');
})
;

export default router;