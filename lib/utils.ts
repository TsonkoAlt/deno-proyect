import type { customState, User, MenssageRender, Msg } from './types.ts';

const listOfUsers: User[] = [];
const listOfMsgs: Msg = [
    'all msg',
    [],
];

export const state = {
    sockets: new Set<WebSocket>(),
    sendToAllSockets(data: string, current: WebSocket | undefined) {
        for (const ws of this.sockets) {
            if (ws === current) continue;
            ws.send(data);
        }
    },
    getAllMenssages(user) {
        const data = JSON.stringify(listOfMsgs);
        const parseData = data.replaceAll(`"${user.username}"`, '"yo"');
        return parseData;
    },
    pushMenssage(msg) {
        listOfMsgs[1].push(msg);
    },

} as customState;

export function userValidate(user: User) : MenssageRender {
    if (user.username === null || user.password === null) return 'complit all fields';
    if (user.username.length < 8) return 'user must be least eight characters';
    if (user.password.length < 8) return 'password must be least eight characters';
    if (!/\d/.test(user.password)) return 'password must have at least one number';
    if (!/[A-Z]/.test(user.password)) return 'password must be uppercase';
    if (!/[a-z]/.test(user.password)) return 'password must be lowercase';
    if (/\W/.test(user.password)) return 'password must only have alphanumeric characters and underscore';
    if (/\W/.test(user.username)) return 'user must only have alphanumeric characters and underscore';
    for (const { username } of listOfUsers) {
        if (username === user.username) return 'user already exist';
    }
    listOfUsers.push(user);
    return;
}