import { Router, bcrypt, REDIRECT_BACK } from '../deps.ts';

import type { CustomState } from '../lib/types.ts'
import { userValidateSignup, userValidateLogin } from '../lib/utils.ts';

const router = new Router<CustomState>();

router
.get('/signup', async ({ state, app, response }) => {
    const appState = <CustomState>app.state;
    if (await state.session.has('profile')) response.redirect(REDIRECT_BACK, '/');
    else {
        await state.render?.('auth/signup');
        appState.menssageRender = undefined;
    }
})
.post('/signup',
    async ({ request, response, app, state }) => {
        const appState = <CustomState>app.state;
        const params: URLSearchParams = await request.body().value;
        const user = {
            username: params.get('username'),
            password: params.get('password'),
        };
        appState.menssageRender = userValidateSignup(user);
        if (appState.menssageRender !== undefined) response.redirect('/signup');
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
    const appState = <CustomState>app.state;
    if (await state.session.has('profile')) response.redirect('/');
    else {
        await state.render?.('auth/login');
        appState.menssageRender = undefined;
    }
})
.post('/login',
    async ({ request, response, app, state }) => {
        const appState = <CustomState>app.state;
        const params: URLSearchParams = await request.body().value;
        const user = {
            username: params.get('username'),
            password: params.get('password'),
        }
        appState.menssageRender = await userValidateLogin(user);
        if (appState.menssageRender !== undefined) response.redirect('/login');
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