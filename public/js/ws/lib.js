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
 *  @arg {HTMLElement} chat
 * @arg {{user: string, text: string}} msgData
 * */
export function addMsg(chat, msgData) {
    const msg = document.createElement('li');
    msg.classList.add('chat--msg');

    const user = document.createElement('h4');
    user.innerText = msgData.user;
    msg.appendChild(user);
    
    const text = document.createElement('p');
    text.innerText = msgData.msg;
    msg.appendChild(text);

    chat.appendChild(msg);
}
/**
 * @arg {HTMLElement} list 
 * @arg {string[]} users 
 */
export function paintUsers(list, users) {
    const frag = new DocumentFragment()
    for (const user of users) {
        const li = document.createElement('li');
        li.innerText = user;
        frag.appendChild(li);
    }
    if (list.children.length > 0) {
        list.replaceChild(frag, list.children[0]);
    } else {
        list.appendChild(frag);
    }
}