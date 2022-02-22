import type { Session } from '../deps.ts';

export type MenssageRender
=   'complit all fields'
|   'password must have at least one number'
|   'password must be uppercase'
|   'password must be lowercase'
|   'password must only have alphanumeric characters and underscore'
|   'password must be least eight characters'
|   'user already exist'
|   'user must only have alphanumeric characters and underscore'
|   'user must be least eight characters'
|   'user or password are incorrect'
|   undefined;

export type Msg = [
    string,
    UserAndMsg[],
];
interface TemplateDelegate<T = unknown> {
    (ctx?: T, options?: Data): string;
}
interface Data {
    root: Record<string, unknown>;
    _parent: {
        root: Record<string, unknown>
    };
    key: number;
    index: number;
    first: boolean;
    last: boolean;
}
export interface User {
    username: string;
    password: string;
}
export interface UserOrNull {
    username: string | null;
    password: string | null;
}
export interface UserAndMsg {
    user: string;
    msg: string;
}
export interface UserAndWS {
    username: string;
    socket: WebSocket;
} 

export interface CustomState {
    render?:(
        filename: string,
        data?: Record<string, unknown>
    ) => Promise<void>;
    menssageRender?: MenssageRender;
    session: Session;
}
export interface ORM {
    sockets: Set<UserAndWS>;
    sendToAllSockets:(data: string, current?: WebSocket, currentUser?: string) => void;
    getAllMenssages(user: string) : UserAndMsg[];
    pushMenssage(msg: UserAndMsg) : void;
    getAllUsers(user?: string) : string;
}
export interface HelperOptions {
    fn: TemplateDelegate;
    inverse: TemplateDelegate;
    hash: string | number;
    data?: Data;
}