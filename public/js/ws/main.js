import { addMsg, isParsable, paintUsers, socket } from './lib.js';

const sendChat = document.getElementById('chat--form');
const chatRoom = document.getElementById('chat--room');
const chatUsers = document.getElementById('chat--users');

socket.addEventListener('message', (evt) => {
  const [isCustomEvent, data] = isParsable(evt.data);
  if (isCustomEvent) {
    if (data[0] === 'chating') {
      addMsg(chatRoom, data[1]);
    } else if (data[0] === 'users') {
      console.log(data[1]);
      paintUsers(chatUsers, data[1]);
    }
  } else console.log(data);
});

sendChat.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const text = sendChat.text.value;
  socket.send(JSON.stringify(['chating', text]));
  sendChat.reset();
  addMsg(chatRoom, { user: 'yo', msg: text });
});

chatRoom.addEventListener('scroll', () => {
  console.log(chatRoom.scrollTop, chatRoom.scroll, chatRoom.scrollHeight);
});
