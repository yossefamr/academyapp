'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, Unlock, Loader2, Users, MessageSquare, Shield, Crown } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { PageHeader } from '@/components/lycans/AppShell';
import { RoleBadge } from '@/components/lycans/badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, ChatRoomState } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ChatScreen() {
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState<{ id: string; name: string; photo: string; role: string }[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (data.closed) {
        setMessages([]);
        setRoom(data.room);
      } else {
        setMessages(data.messages || []);
        setRoom(data.room);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Socket connection
  useEffect(() => {
    if (!user) return;
    const socket = io('/?XTransformPort=3003', { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('identify', { id: user.id, name: user.name, photo: user.photo, role: user.role });
    });

    socket.on('message:new', (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('room:state', (state: { isOpen: boolean; openedBy: string | null }) => {
      setRoom((prev) => (prev ? { ...prev, ...state, openedAt: state.isOpen ? new Date().toISOString() : null } : { id: 'main', isOpen: state.isOpen, openedBy: state.openedBy, openedAt: state.isOpen ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }));
      if (state.isOpen) {
        fetchMessages();
        toast({ title: '🐺 The pack chat is open', description: 'The coach has opened the den.' });
      } else {
        toast({ title: '🚪 The pack chat is closed', description: 'The coach closed the den.' });
      }
    });

    socket.on('presence', (data: { online: { id: string; name: string; photo: string; role: string }[] }) => {
      setOnline(data.online || []);
    });

    socket.on('typing', (data: { name: string; isTyping: boolean }) => {
      if (data.name === user.name) return;
      setTypingUser(data.isTyping ? data.name : null);
      if (data.isTyping) {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 3000);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // auto scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    if (!isAdmin && !room?.isOpen) {
      toast({ title: 'Chat is closed', description: 'The coach must open the pack chat.', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      // broadcast via socket
      socketRef.current?.emit('message:send', data.message);
      // local append + broadcast received by self too; dedupe by id
      setMessages((prev) => (prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message]));
      setText('');
    } catch (err) {
      toast({ title: 'Failed to send', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  }

  function handleTyping(v: string) {
    setText(v);
    if (!socketRef.current || !user) return;
    socketRef.current.emit('typing', { name: user.name, isTyping: v.length > 0 });
  }

  async function toggleRoom() {
    if (!room) return;
    setToggling(true);
    try {
      const res = await fetch('/api/chat/room', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !room.isOpen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoom(data.room);
      socketRef.current?.emit('room:state', { isOpen: data.room.isOpen, openedBy: data.room.openedBy });
      toast({ title: data.room.isOpen ? 'Pack chat opened' : 'Pack chat closed' });
    } catch (err) {
      toast({ title: 'Failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setToggling(false);
    }
  }

  if (!user) return null;
  const roomClosed = !room?.isOpen;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Pack Chat" subtitle="Group chat — opened by the coach" icon={MessageSquare} />

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        {/* Chat panel */}
        <Card className="flex h-[70vh] flex-col overflow-hidden border-border/50 bg-card/60 backdrop-blur">
          {/* Chat header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/50 bg-background/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', roomClosed ? 'bg-muted-foreground/50' : 'bg-blood animate-pulse')} />
              <div>
                <p className="text-sm font-bold">Lycans Pack</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {roomClosed ? 'Closed by coach' : 'Open'} · {online.length} online
                </p>
              </div>
            </div>
            {isAdmin && (
              <Button
                onClick={toggleRoom}
                disabled={toggling}
                size="sm"
                variant="outline"
                className={cn('rounded-full border-2 text-xs font-bold uppercase tracking-wider', roomClosed ? 'border-blood/50 text-blood hover:bg-blood/10' : 'border-silver/40 hover:bg-muted')}
              >
                {toggling ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : roomClosed ? <Unlock className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
                {roomClosed ? 'Open' : 'Close'}
              </Button>
            )}
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : roomClosed && messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <Lock className="h-10 w-10 opacity-40" />
                <p className="font-display text-sm tracking-widest text-blood">CHAT IS LOCKED</p>
                <p className="max-w-xs text-xs">The coach opens the pack chat when it&apos;s time to gather the wolves.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const mine = m.memberId === user.id;
                  const isCoach = m.memberRole === 'ADMIN' || m.memberRole === 'SUPER_ADMIN';
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex gap-2.5', mine ? 'flex-row-reverse' : 'flex-row')}
                    >
                      <Avatar className={cn('mt-0.5 h-8 w-8 border', isCoach ? 'border-blood/50' : 'border-border/40')}>
                        <AvatarImage src={m.memberPhoto} alt={m.memberName} />
                        <AvatarFallback className={cn('text-xs font-bold', isCoach ? 'bg-blood/20 text-blood' : 'bg-muted')}>{m.memberName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn('flex max-w-[78%] flex-col', mine ? 'items-end' : 'items-start')}>
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <span className="text-[11px] font-bold">{mine ? 'You' : m.memberName}</span>
                          {isCoach && (m.memberRole === 'SUPER_ADMIN' ? <Crown className="h-3 w-3 text-amber-400" /> : <Shield className="h-3 w-3" style={{ color: 'var(--blood)' }} />)}
                          <span className="text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={cn(
                            'rounded-2xl px-3.5 py-2 text-sm',
                            mine ? 'rounded-tr-sm text-white' : 'rounded-tl-sm bg-muted text-foreground'
                          )}
                          style={mine ? { background: 'linear-gradient(135deg, var(--blood), color-mix(in oklch, var(--blood) 60%, black))' } : {}}
                        >
                          {m.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {typingUser && (
                  <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-blood" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </span>
                    {typingUser} is typing…
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 bg-background/40 p-3">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => handleTyping(e.target.value)}
                disabled={roomClosed && !isAdmin}
                placeholder={roomClosed && !isAdmin ? 'Chat is locked by the coach' : 'Speak to the pack…'}
                className="flex-1 rounded-full border border-border/60 bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-blood/60 focus:outline-none disabled:opacity-50"
                maxLength={1000}
              />
              <Button
                type="submit"
                disabled={sending || (roomClosed && !isAdmin) || !text.trim()}
                size="icon"
                className="h-10 w-10 rounded-full"
                style={{ background: 'linear-gradient(135deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>

        {/* Online members sidebar */}
        <Card className="hidden flex-col border-border/50 bg-card/60 backdrop-blur lg:flex">
          <div className="border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: 'var(--blood)' }} />
              <h3 className="font-display text-xs tracking-widest">ONLINE PACK</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {online.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">No wolves online.</p>
            ) : (
              <ul className="space-y-1">
                {online.map((o) => (
                  <li key={o.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50">
                    <div className="relative">
                      <Avatar className="h-7 w-7 border border-border/40">
                        <AvatarImage src={o.photo} alt={o.name} />
                        <AvatarFallback className="text-[10px] font-bold">{o.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                    </div>
                    <span className="truncate text-xs font-medium">{o.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
