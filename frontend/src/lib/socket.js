import { io } from 'socket.io-client';

import { server } from './apiList'

const socket = io(server)

export default socket