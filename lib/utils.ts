import { bcrypt } from '../deps.ts';

import type { ORM, User, MenssageRender, UserAndWS, UserAndMsg, UserOrNull } from './types.ts';

const listOfUsers: User[] = [];
const listOfMsgs: UserAndMsg[] = [];

export const orm = {
    sockets: new Set<UserAndWS>(),
    sendToAllSockets(data, current, curentUser) {
        const newData = data.replaceAll(`"user":"${curentUser}"`, '"user":"yo"');
        for (const ws of this.sockets) {
            if (ws.socket === current) continue;
            else if (curentUser === ws.username) ws.socket.send(newData);
            else ws.socket.send(data);
        }
    },
    getAllMenssages(username) {
        return listOfMsgs.map(value => {
            return {
                user: username === value.user ? 'yo' : value.user,
                msg: value.msg,
            };
        });
    },
    pushMenssage(msg) {
        listOfMsgs.push(msg);
    },
    getAllUsers(username) {
        const users =
        listOfUsers.map(value => {
            if (value.username !== username) return value.username;
            else return 'yo';
        });
        const data : [ 'users', string[] ] =
        [
            'users',
            users
        ];
        console.log(listOfUsers);
        console.log(data);
        return JSON.stringify(data);
    }

} as ORM;

export function userValidateSignup(user: UserOrNull) : MenssageRender {
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
    listOfUsers.push(user as User);
    return;
}

export async function userValidateLogin(user: UserOrNull) : Promise<MenssageRender> {
    if (user.username === null || user.password === null) return 'complit all fields';
    for (const { username, password } of listOfUsers) {
        if (username === user.username && await bcrypt.compare(user.password, password as string)) {
            return;
        }
    }
    return 'user or password are incorrect'
}