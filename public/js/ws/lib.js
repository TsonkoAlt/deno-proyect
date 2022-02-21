const path = `${window.location.origin.replace('http', 'ws')}/ws`;
export const socket = new WebSocket(path);

export function isParsable(data) {
    try {
        return [ true, JSON.parse(data) ];
    } catch(err) {
        if (err.name) return [ false, data ];
        console.log(err);
    }
}

/**
 *  @arg { HTMLElement } chat
 * @arg { { user: string, msg: string } } msgData
 * */
export function addMsg(chat, msgData) {
    const msg = document.createElement('li');
    msg.classList.add('chat--msg');

    const user = document.createElement('h4');
    if (msgData.user === 'yo') msg.classList.add('me');
    user.appendChild(
        document.createTextNode(msgData.user),
    );
    msg.appendChild(user);
    
    const text = document.createElement('p');
    text.appendChild(
        document.createTextNode(msgData.msg),
    );
    msg.appendChild(text);

    chat.appendChild(msg);
}
/**
 * @arg { HTMLElement } list
 * @arg { string[] } users
 */
export function paintUsers(list, users) {
    const frag = new DocumentFragment()
    for (const user of users) {
        const li = document.createElement('li');
        li.appendChild(
            document.createTextNode(user),
        );
        frag.appendChild(li);
    }
    if (list.children.length > 0) {
        list.replaceChildren();
        list.appendChild(frag);
    } else {
        list.appendChild(frag);
    }
}