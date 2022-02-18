import { Router, bcrypt, REDIRECT_BACK } from '../deps.ts';

import type { customState } from '../lib/types.ts'
import { userValidateSignup, userValidateLogin } from '../lib/utils.ts';

const router = new Router<customState>();

router
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
        console.log('estas aqui');
        const params: URLSearchParams = await request.body().value;
        const user = {
            username: params.get('username'),
            password: params.get('password'),
        };
        app.state.menssageRender = userValidateSignup(user);
        console.log(user, app.state.menssageRender);
        if (app.state.menssageRender !== undefined) response.redirect('/signup');
        else {
            user.password = await bcrypt.hash(
                user.password ?? '',
                await bcrypt.genSalt(8),
            );
            await state.session.set('profile', user);
            response.redirect('/profile');
        }
    }
)
.get('/login', async ({ state, app, response }) => {
    if (await state.session.has('profile')) response.redirect('/');
    else {
        console.log(state.menssageRender);
        await state.render?.('auth/login');
        app.state.menssageRender = undefined;
    }
})
.post('/login',
    async ({ request, response, app, state }) => {
        const params: URLSearchParams = await request.body().value;
        const user = {
            username: params.get('username'),
            password: params.get('password'),
        }
        app.state.menssageRender = await userValidateLogin(user);
        if (app.state.menssageRender !== undefined) response.redirect('/login');
        else {
            await state.session.set('profile', user);
            response.redirect('/profile');
        }

    }
)
.get('/logout', async ({ state, response }) => {
    await state.session.deleteSession();
    response.redirect('/');
})
;

export default router;