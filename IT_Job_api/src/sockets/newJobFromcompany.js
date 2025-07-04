export const notiOfNewJob = (socket) => {
    socket.on('FE_NOTIFICATION_NEW_JOBS', (notification) => {
        socket.broadcast.emit('FE_NOTIFICATION_NEW_JOBS', notification)
    })
}