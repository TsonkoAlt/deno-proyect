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

function active(pathname: string, ref: string, opts: HelperOptions) {
    if (pathname === ref) return `<a class="active" href="${ref}">${opts.fn()}</a>`;
    return `<a href="${ref}">${opts.fn()}</a>`;
}
function isChat(pathname: string, opts: HelperOptions) {
    if (pathname === '/chat') return opts.fn();
}

export const helpers = { active, isChat };