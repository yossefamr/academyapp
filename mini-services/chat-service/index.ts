import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 3003;

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/',
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const onlineUsers = new Map<string, { id: string; name: string; photo: string; role: string }>();

// Dedupe by user id & filter invalid entries, then broadcast
function broadcastPresence() {
  const byId = new Map<string, { id: string; name: string; photo: string; role: string }>();
  for (const u of onlineUsers.values()) {
    if (u && typeof u === 'object' && u.id && u.name) {
      byId.set(u.id, u);
    }
  }
  io.emit('presence', { online: Array.from(byId.values()) });
}

io.on('connection', (socket) => {
  console.log(`[chat] connected: ${socket.id}`);

  // Client identifies itself with member info after auth
  socket.on('identify', (data: { id: string; name: string; photo: string; role: string }) => {
    if (!data || typeof data !== 'object' || !data.id || !data.name) return;
    onlineUsers.set(socket.id, data);
    socket.data.user = data;
    broadcastPresence();
  });

  // Real-time message broadcast. Persistence is handled by the Next.js API,
  // but we also broadcast so everyone sees it instantly.
  socket.on('message:send', (msg: {
    id: string;
    memberId: string;
    memberName: string;
    memberPhoto: string;
    memberRole: string;
    content: string;
    createdAt: string;
  }) => {
    io.emit('message:new', msg);
  });

  // Room state change broadcast (open/close) from admin
  socket.on('room:state', (state: { isOpen: boolean; openedBy: string | null }) => {
    io.emit('room:state', state);
  });

  // Typing indicator
  socket.on('typing', (data: { name: string; isTyping: boolean }) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    const u = onlineUsers.get(socket.id);
    if (u) {
      onlineUsers.delete(socket.id);
      broadcastPresence();
    }
    console.log(`[chat] disconnected: ${socket.id}`);
  });

  socket.on('error', (err) => console.error(`[chat] socket error (${socket.id}):`, err));
});

httpServer.listen(PORT, () => {
  console.log(`🐺 Lycans chat service running on port ${PORT}`);
});

process.on('SIGTERM', () => httpServer.close(() => process.exit(0)));
process.on('SIGINT', () => httpServer.close(() => process.exit(0)));
