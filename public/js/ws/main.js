import { isParsable, socket, addMsg } from './lib.js';

const sendChat = document.getElementById('chat--form');
const chatRoom = document.getElementById('chat--room');

socket.addEventListener('message', evt => {
    const [ isCustomEvent, data ] = isParsable(evt.data);
    if (isCustomEvent) {
        if (data[0] === 'chating') {
            addMsg(chatRoom, data[1]);
        }
    } else {
        console.log(data);
    }
});

sendChat.addEventListener('submit', evt => {
    const data = {
        user: sendChat.user.value,
        text: sendChat.text.value
    }
    evt.preventDefault();
    socket.send(JSON.stringify([ 'chating', data ]));
    sendChat.reset();
    addMsg(chatRoom, data);
});