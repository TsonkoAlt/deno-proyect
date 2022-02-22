import type { HelperOptions } from './types.ts';

export async function thisFileExist(filename: string): Promise<boolean> {
    try {
        const stat = await Deno.lstat(filename);
        return stat && stat.isFile;
    } catch (e) {
        if (e && e instanceof Deno.errors.NotFound) return false;
        throw e;
    }
}

export async function watch(fn: () => void) {
    const paths = [ `${Deno.cwd()}/public`, `${Deno.cwd()}/views` ];
    const watcher = Deno.watchFs(paths);
    for await (const { kind } of watcher) {
        if (kind === 'any' || kind === 'access') continue;
        fn();
    }
}

/* handlebars helpers */

function active(ref: string, opts: HelperOptions) {
    const pathname = opts?.data?.root.pathname;
    return `<a class="refbtn animation ${ pathname === ref ? 'active' : '' }" href="${ ref }">
    ${ opts.fn() }
</a>`;
}
function isChat(pathname: string, opts: HelperOptions) {
    if (pathname === '/chat') return opts.fn();
}
function itsMe(user: string) {
    return `<li class="chat--msg ${ user === 'yo' ? 'me' : '' }">`;
}

export const helpers = { active, isChat, itsMe };