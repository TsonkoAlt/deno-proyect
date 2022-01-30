import './lib.js';

const sendChat = document.getElementById('chat--form');
const chatRoom = document.getElementById('chat--room');

socket.addEventListener('message', evt => {
    const data = isParsable(evt.data);
    if (typeof data === 'object') {
        if (data?.type === 'chating') {
            chatRoom.innerHTML +=
                `<li class="room--msg">
                    <h4>${data?.username}</h4>
                    <span>${data?.menssage}</span>
                </li>`;
        }
    } else {
        console.log(evt.data);
    }
});

sendChat.addEventListener('submit', evt => {
    const username = sendChat.username.value;
    const menssage = sendChat.menssage.value;
    evt.preventDefault();
    socket.send(JSON.stringify({ type: 'chating', username, menssage }));
    sendChat.reset();
});