'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, Quote, MessageSquarePlus, Filter } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { PageHeader } from '@/components/lycans/AppShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Feedback as FeedbackType } from '@/lib/types';

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'facility', label: 'Facility' },
  { id: 'sparring', label: 'Sparring' },
];

export default function FeedbackScreen() {
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [list, setList] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchList = () => {
    fetch('/api/feedback')
      .then((r) => r.json())
      .then((d) => setList(d.feedback || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchList(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) { toast({ title: 'Pick a rating', variant: 'destructive' }); return; }
    if (!comment.trim()) { toast({ title: 'Write a comment', variant: 'destructive' }); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setList((prev) => [data.feedback, ...prev]);
      setRating(0); setComment(''); setCategory('general');
      toast({ title: 'Feedback received 🐺', description: 'The pack hears you.' });
    } catch (err) {
      toast({ title: 'Failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  const avg = list.length ? (list.reduce((a, b) => a + b.rating, 0) / list.length) : 0;
  const filtered = filter === 'all' ? list : list.filter((f) => f.category === filter);

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Feedback" subtitle="Howl your thoughts to the pack" icon={Star} />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        {/* Submit form */}
        <Card className="border-blood/20 bg-card/60 p-5 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" style={{ color: 'var(--blood)' }} />
            <h2 className="font-display text-sm tracking-widest">LEAVE FEEDBACK</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${n}`}
                  >
                    <Star
                      className={cn('h-8 w-8 transition-all', (hover || rating) >= n ? 'fill-current' : 'fill-transparent')}
                      style={{ color: (hover || rating) >= n ? 'var(--blood)' : 'var(--muted-foreground)' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors',
                      category === c.id ? 'border-blood bg-blood/15 text-blood' : 'border-border/60 text-muted-foreground hover:border-blood/40'
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Words</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience, suggestion, or battle cry…"
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-blood/60 focus:outline-none"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{comment.length}/1000</p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full py-5 text-sm font-bold uppercase tracking-widest"
              style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Feedback
            </Button>
          </form>
        </Card>

        {/* Feedback list */}
        <div className="space-y-4">
          {/* Summary */}
          <Card className="flex items-center justify-between border-border/50 bg-card/60 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood/15">
                <Star className="h-6 w-6 fill-current" style={{ color: 'var(--blood)' }} />
              </div>
              <div>
                <p className="text-3xl font-black leading-none">{avg.toFixed(1)}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg · {list.length} reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-border/60 bg-background/60 px-2 py-1.5 text-xs focus:border-blood/60 focus:outline-none"
              >
                <option value="all">All</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </Card>

          {/* List */}
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                <Quote className="h-8 w-8 opacity-40" />
                <p className="text-sm">No feedback yet. Be the first to howl.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="border-border/50 bg-card/60 p-4 backdrop-blur">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-blood/30">
                          <AvatarImage src={f.memberPhoto} alt={f.memberName} />
                          <AvatarFallback className="bg-blood/20 text-blood font-bold">{f.memberName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <div>
                              <p className="text-sm font-bold">{f.memberName}</p>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {f.category} · {new Date(f.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star key={n} className={cn('h-3.5 w-3.5', n <= f.rating ? 'fill-current' : 'fill-transparent')} style={{ color: n <= f.rating ? 'var(--blood)' : 'var(--muted-foreground)' }} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{f.comment}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
