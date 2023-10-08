class RoomRes {
    constructor({ _id, player }) {
        this._id = _id
        this.player = {
            _id: player._id,
            isOnRoom: player.isOnRoom,
            isRoomMaster: player.isRoomMaster,
            isReady: player.isReady,
            position: player.position,
        }
    }
}

module.exports = RoomRes
