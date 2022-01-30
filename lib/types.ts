export type ChatingEvent =
    CustomEvent<{
        username: string;
        menssage: string;
    }>;

export type customState = {
    render: ((
        filename: string,
        data?: Record<string, unknown> | undefined
    ) => Promise<void>) | undefined;
    sockets: Set<WebSocket> | undefined;
    addSocket:((ws: WebSocket) => Set<WebSocket>) | undefined;
    removeSocket:((ws: WebSocket) => boolean) | undefined;
    sendToAllSocket: ((data: string) => void) | undefined;
};

interface TemplateDelegate<T = unknown> {
    (ctx?: T, options?: Record<string, unknown>): string;
}

export interface HelperOptions {
    fn: TemplateDelegate;
    inverse: TemplateDelegate;
    hash: string | number;
    data?: Record<string, unknown>;
}