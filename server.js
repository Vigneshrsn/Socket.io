// const http = require('http');
// const server = http.createServer((req, res) => {
//     console.log('request made');
//     res.setHeader('content-type', 'text/plain');
//     res.write("hello");
//     res.end();
// });
// server.listen(3000, 'localhost', () => {
//     console.log("listening")
// });

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const formatmsg = require('./utils/messages');
const { userjoin, getcurrentuser, userleave, roomuser } = require('./utils/user');
const io = socketio(server);




// app.set("view engine", "ejs");
// app.engine("html", require("ejs").renderFile);
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
const botname = 'Chat Bot';
// server.listen(port, () => {

//     console.log('listening');
// });
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// })
// app.post("/chat", (req, res) => {
//     var name = req.body.username;
//     res.render(__dirname + "/public/chat.html", { name: name });
// })
io.on('connection', socket => {
    socket.on('joinroom', ({ username, room }) => {
        const user = userjoin(socket.id, username, room);
        socket.join(user.room)
        socket.emit('message', formatmsg(botname, 'welcome to chat'));
        socket.broadcast.to(user.room).emit('message', formatmsg(botname, `${username} connected`));
        io.to(user.room).emit('roomuser', {
            room: user.room,
            users: roomuser(user.room)
        })



    })
    socket.on('chatmessage', msg => {
        const user = getcurrentuser(socket.id);
        io.to(user.room).emit('message', formatmsg(user.username, msg));
    });
    socket.on('disconnect', () => {
        const user = userleave(socket.id);

        io.to(user.room).emit('message', formatmsg(botname, `${user.username} left chat`));
        io.to(user.room).emit('roomuser', {
            room: user.room,
            users: roomuser(user.room)
        })

    });

})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`running on port ${PORT}`));