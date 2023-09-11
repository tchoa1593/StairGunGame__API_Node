module.exports = function (io) {
    io.on('connection', function (socket) {
        // console.log(socket)
        console.log(`A user connected  ${socket.id}, clientID: ${socket.client.id}`)
        socket.on('disconnect', function () {
            console.log(`A user disconnected, ${socket?.id}, clientID: ${socket?.client?.id}`)
        })
        socket.on('send-message', function (event) {
            console.log(`ClientID: ${socket?.client?.id}, event: ${event}`)
        })
    })
}
