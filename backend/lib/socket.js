
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
            console.log(message)
            io.in(message.to).emit("message", {...message, you: false})
            io.in(message.from).emit("message", {...message, you: true})
        })

    })
}

module.exports = initSocket