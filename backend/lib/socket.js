
const initSocket = (app,io) => {
    console.log('initiate socket')
    io.on('connection', socket => {
        console.log('An user connected', socket.id);
        app.set('socket.io', {io, socket});
        socket.on("disconnect", () => {
            console.log('An user disconnected', socket.id);
        })

        socket.on("join chat", id => {
            console.log('join', id)
            socket.join(id)
        })

        socket.on("message", message => {
            console.log("send message", message)
            io.in(message.chatId).emit("message", {...message})
        })

    })
}

module.exports = initSocket