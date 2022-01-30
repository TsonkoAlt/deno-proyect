class liMsg extends HTMLLIElement {
    constructor() {
        #user, #msg;
        super();
        this.#user = document.createElement('h4');
        this.#mgs = document.createElement('span');
    }
}

customElements.define('li-msg', liMsg, { extends: "li" });

const path = `${window.location.origin.replace('http', 'ws')}/ws`;
const socket = new WebSocket(path);

function isParsable(data) {
    try {
        return JSON.parse(data);
    } catch(err) {
        if (err.name) return false;
        console.log(err);
    }
}