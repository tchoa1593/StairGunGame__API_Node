const { default: mongoose } = require('mongoose')
const { UserModel, RoomModel } = require('../../../app/models')
const RoomAddRes = require('./room.add.res')
const RoomPlayerRemoveRes = require('./room.player.remove.res')

class room {
    // #region again
    // emit: rooms/players/add/res, rooms/players/add/res/error
    async reGoIntoMatch(socket, io) {}
    // #endregion again

    // on: rooms/players/add | emit: rooms, rooms/players/add/res, rooms/players/add/res/error
    add(socket, io) {
        return async ({ idRoom }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom)

                console.log(
                    'Go on room..., idRoom: ',
                    idRoom,
                    ', type room: ',
                    room.type,
                    ', player: ' + idPlayer,
                )
                const nowPlayerOnRoom = await RoomModel.find({
                    'players.player': socket.handshake.idPLayer,
                    'players.isOnRoom': true,
                })
                if (nowPlayerOnRoom.length > 0) {
                    socket.emit('rooms/players/add/res/error', {
                        status: 400,
                        message: 'Người chơi đã có phòng!',
                    })
                    return
                }
                if (room.type === 'Tự do') {
                    let newPosition = 0
                    const countPlayerOnRoom = room.players.reduce((total, p) => {
                        if (newPosition === p.position && p.isOnRoom) newPosition += 1
                        if (p.isOnRoom) total += 1
                        return total
                    }, 0)
                    if (countPlayerOnRoom < room.maxNum) {
                        const playerGoOnAgain = room.players.find(
                            (p) => p.player.toString() === socket.handshake.idPlayer,
                        )

                        if (playerGoOnAgain !== undefined) {
                            playerGoOnAgain.isOnRoom = true
                            playerGoOnAgain.position = newPosition
                        } else {
                            console.log('Room tu do...')
                            const playerOnRoom = {
                                player: idPlayer,
                                isOnRoom: true,
                                isRoomMaster: false,
                                position: newPosition,
                            }
                            room.players.push(playerOnRoom)
                        }
                        await room.save()

                        // console.log(room.players)
                        socket.join(room._id.toString())

                        const r = room.toObject()
                        for (const p of r.players) {
                            const player = await UserModel.findById(p.player).lean()
                            p.player = player
                        }

                        console.log('Connections on room: ', io.sockets.adapter.rooms.get(room._id))
                        io.to(room._id.toString()).emit('rooms/players/add/res', {
                            data: new RoomAddRes(r),
                        })
                        io.emit('rooms', {
                            type: 'update',
                            data: room,
                        })
                        return
                    }

                    return socket.emit('rooms/players/add/res/error', {
                        status: 400,
                        message: 'Vào phòng thất bại!',
                    })
                }
            } catch (error) {
                console.log(error)
                socket.emit('rooms/players/add/res/error', {
                    status: 400,
                    message: 'Phòng không tồn tại!',
                })
                return
            }
            return
        }
    }

    // on: rooms/create | emit: rooms, rooms/players/add/res, rooms/players/add/res/error
    create(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            console.log('Create room from request of: ' + idPlayer)
            // const player = await UserModel.findById(idPlayer)
            const nowPlayerOnRoom = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            })

            if (nowPlayerOnRoom.length > 0) {
                socket.emit('rooms/players/add/res/error', {
                    status: 400,
                    message: 'Người chơi đã có phòng!',
                })
                return
            } else {
                console.log('create player')
                try {
                    const player = await UserModel.findById(idPlayer)
                    const playerOnRoom = {
                        player: idPlayer,
                        isOnRoom: true,
                        isRoomMaster: true,
                        position: 0,
                    }
                    const room = new RoomModel()
                    room.players.push(playerOnRoom)

                    await room.save()
                    const r = room.toObject()
                    socket.join(r._id.toString())

                    io.emit('rooms', { type: 'create', data: r })

                    r.players[0].player = { ...player.toObject() }
                    socket.emit('rooms/players/add/res', {
                        data: new RoomAddRes(r),
                    })
                } catch (error) {
                    console.log('create room: ', error)
                    socket.emit('rooms/players/add/error', {
                        status: 400,
                        message: 'Người chơi không hợp lệ!',
                    })
                }
                return
            }
        }
    }

    goOut(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            const rooms = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            }).lean()
            console.log('Go out: ' + socket.handshake.idPlayer)

            for (const room of rooms) {
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false
                        let newMaster = undefined
                        if (p.isRoomMaster) {
                            p.isRoomMaster = false
                            const otherP = room.players.find(
                                (p) => p.isOnRoom && p.player.toString() !== idPlayer,
                            )

                            if (otherP) {
                                otherP.isRoomMaster = true
                                newMaster = otherP.player
                            }
                        }
                        console.log('emit ', room._id.toString())
                        socket.to(room._id.toString()).emit('rooms/players/remove/res', {
                            data: new RoomPlayerRemoveRes({
                                player: idPlayer,
                                position: p.position,
                                newMaster,
                            }),
                        })
                    }
                })

                socket.leave(room._id.toString())
                // console.log(room)
                await RoomModel.updateOne({ _id: room._id }, room)
                io.emit('rooms', { type: 'update', data: new RoomAddRes(room) })
            }
            // console.log(rooms[rooms.length - 1])

            socket.emit('rooms/players/goOut/res')
        }
    }
}

module.exports = new room()