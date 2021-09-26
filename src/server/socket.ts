import { Server } from "socket.io";
import cuid from 'cuid'
import logger from "./logger";

let socket;

interface Room {
  id: string
  host: string
}

export default function SocketServer(): Server {
  const namespaces = new Map<string, Map<string, Room>>()

  socket = new Server({
    cors: { origin: "https://www.funimation.com", methods: ["GET", "POST"] }
  });


  socket.of(/^\/v-.+$/).on("connection", (client) => {
    const namespace = client.nsp;
    const rooms = namespaces.get(namespace.name) ?? namespaces.set(namespace.name, new Map()).get(namespace.name)

    logger.info('new-client: %s', client.id)
    console.log([...rooms.values()])

    client.emit('new-rooms', [...rooms.values()])

    client.on('host', () => {
      const room: Room = {
        id: cuid(),
        host: client.id
      }

      logger.info('new-room', room)

      rooms.set(room.id, room)
      namespace.emit('new-rooms', [room])
      client.emit('join-room', room);
      client.join(room.id)

      client._room_id = room.id
    })

    client.on('join', (id) => {
      console.log({ id })

      logger.info('client-joining: %s', id)
      const room = rooms.get(id)

      client.emit('join-room', room);
      client.join(room.id)

      client._room_id = room.id
    })

    client.on('player-update', (currentTime) => {
      namespace.to(client._room_id).emit('player-update', currentTime)
      logger.info('player-update: %s %s', client._room_id, currentTime)

    })
    client.on('player-play', () => {
      namespace.to(client._room_id).emit('player-play')
    })
    client.on('player-pause', () => {
      namespace.to(client._room_id).emit('player-pause')
    })
  });


  return socket;
}


export function getSocketServer(): Server {
  return socket;
}