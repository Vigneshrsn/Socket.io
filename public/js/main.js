const chat = document.getElementById('chat-form');
const chatmessages = document.querySelector('.chat-messages');
const roomname = document.getElementById('room-name');
const roomuserss = document.getElementById('users')
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,

});

const socket = io();
socket.emit('joinroom', { username, room });
socket.on('roomuser', ({ room, users }) => {
    outputroomname(room);
    roomusers(users);
});
socket.on('message', message => {
    console.log(message);
    outputmessage(message);

    //scroll down
    chatmessages.scrollTop = chatmessages.scrollHeight;

    // alert(message);
});
chat.addEventListener('submit', (e) => {
    e.preventDefault();
    // var msg = document.getElementById('msg').value;

    // socket.emit('chatmsg', msg);
    // $(".chat-messages").append($(".message"));
    const msg = e.target.elements.msg.value;
    socket.emit('chatmessage', msg); //emit message to server
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();


});

function outputmessage(message) {
    console.log(message);
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">
${message.username}    <span>${message.time}</span></p>
<p class="text"> ${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

function outputroomname(room) {
    roomname.innerText = room;

};

function roomusers(users) {
    roomuserss.innerHTML = `${users.map(user=>`<li>${user.username}</>`).join('')}`;
};