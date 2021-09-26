import { io } from "socket.io-client";
import { derived, readable } from "svelte/store";
import { toast } from '@zerodevx/svelte-toast';

const namespace = window.location.pathname.replace(/\//g, '-').substr('1');

const player = document.querySelector('video.vjs-tech');

export const socket = io(`http://anisync.adl.cafe/${namespace}`);

export const connected = readable(false, (set) => {
  set(socket.connected);

  const update = () => {
    set(socket.connected);
    if (socket.connected) {
      toast.push('Connected to AniSync!', {
        theme: {
          '--toastBackground': '#48BB78',
          '--toastBarBackground': '#2F855A',

        }
      })
    } else {
      toast.push('Disconnected from AniSync!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030',
        }
      })
    }
  }

  socket.on('connect', update);
  socket.on('disconnect', update);

  return () => {
    socket.off('connect', update);
    socket.off('disconnect', update);
  }
});

export const room = readable(null, (set) => {
  socket.on('join-room', (room) => {
    set(room);
  })

  socket.on('leave-room', () => {
    set(null)
  })
});

let _host = false;

export const hosting = derived(room, ($room, set) => {
  set(_host = ($room && $room.host === socket.id))
})

export const rooms = readable([], (set) => {
  let rooms = [];

  socket.on('new-rooms', (newRooms) => {
    console.log('new-rooms', newRooms)

    rooms = [...rooms, ...newRooms];
    set(rooms);
  })
})

player.addEventListener('progress', () => {
  if (_host) {
    socket.emit('player-update', player.currentTime)
  }
})

player.addEventListener('pause', () => {
  if (_host) {
    socket.emit('player-pause')
  }
})

player.addEventListener('play', () => {
  if (_host) {
    socket.emit('player-play')
  }
})

socket.on('player-update', (currentTime) => {
  console.log('player-update', currentTime)
  if (!_host) {
    if (Math.abs(currentTime - player.currentTime) > 2) {
      player.currentTime = currentTime;
    }
  }
})

socket.on('player-pause', () => {
  console.log('player-pause')
  if (!_host) {
    player.pause()
  }
})

socket.on('player-play', () => {
  console.log('player-play')
  if (!_host) {
    player.play()
  }
})