import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'

type Post = {
  id: string
  club: string
  author: string
  body: string
  videoUrl: string
  created: string
  status: 'pending' | 'approved' | 'rejected'
}

const KEY = 'clubs-livefeed-v1'

function uid() {
  return Math.random().toString(36).slice(2, 11)
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [club, setClub] = useState('Robotics')
  const [author, setAuthor] = useState('Club officer')
  const [body, setBody] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [modMode, setModMode] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        setPosts(JSON.parse(raw))
        return
      }
    } catch {
      /* ignore */
    }
    const seed: Post[] = [
      {
        id: uid(),
        club: 'Debate',
        author: 'Coach',
        body: 'Regionals schedule + room assignments posted in Drive.',
        videoUrl: '',
        created: new Date().toISOString(),
        status: 'approved',
      },
    ]
    setPosts(seed)
    localStorage.setItem(KEY, JSON.stringify(seed))
  }, [])

  useEffect(() => {
    if (posts.length) localStorage.setItem(KEY, JSON.stringify(posts))
  }, [posts])

  const approved = useMemo(() => posts.filter((p) => p.status === 'approved'), [posts])
  const pending = useMemo(() => posts.filter((p) => p.status === 'pending'), [posts])

  function submit() {
    if (!body.trim() && !videoUrl.trim()) return
    const p: Post = {
      id: uid(),
      club,
      author: author.trim() || 'Anonymous',
      body: body.trim(),
      videoUrl: videoUrl.trim(),
      created: new Date().toISOString(),
      status: 'pending',
    }
    setPosts((x) => [p, ...x])
    setBody('')
    setVideoUrl('')
  }

  function setStatus(id: string, status: Post['status']) {
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', padding: 'clamp(0.75rem, 3vw, 1.25rem)' }}>
      <h1 style={{ marginTop: 0 }}>School clubs livefeed</h1>
      <p style={{ lineHeight: 1.6, color: '#334155' }}>
        Demo: posts start as <strong>pending</strong>; a moderator approves. Everything is <code>localStorage</code>{' '}
        — swap for a real backend + auth before production. Designed to practice **governance**, not virality without
        moderation.
      </p>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input type="checkbox" checked={modMode} onChange={(e) => setModMode(e.target.checked)} />
        Moderator view
      </label>

      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>New announcement</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Club
          <input value={club} onChange={(e) => setClub(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Author label
          <input value={author} onChange={(e) => setAuthor(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Text
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Video URL (YouTube embed link or school-hosted)
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <button type="button" onClick={submit} style={{ padding: '12px 18px', minHeight: 44, borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>
          Submit for review
        </button>
      </section>

      {modMode && (
        <section style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>Moderation queue ({pending.length})</h2>
          {pending.length === 0 ? (
            <p style={{ color: '#92400e' }}>No pending posts.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pending.map((p) => (
                <li key={p.id} style={{ borderBottom: '1px solid #fde68a', padding: '10px 0' }}>
                  <strong>{p.club}</strong> · {p.author} · {p.created.slice(0, 16).replace('T', ' ')}
                  <div style={{ marginTop: 6 }}>{p.body}</div>
                  {p.videoUrl ? (
                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      Video:{' '}
                      <a href={p.videoUrl} target="_blank" rel="noreferrer">
                        {p.videoUrl}
                      </a>
                    </div>
                  ) : null}
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => setStatus(p.id, 'approved')} style={{ ...btn, background: '#16a34a' }}>
                      Approve
                    </button>
                    <button type="button" onClick={() => setStatus(p.id, 'rejected')} style={{ ...btn, background: '#dc2626' }}>
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section>
        <h2 style={{ fontSize: '1.05rem' }}>Approved feed</h2>
        {approved.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nothing approved yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {approved.map((p) => (
              <li key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {p.club} · {p.author} · {p.created.slice(0, 16).replace('T', ' ')}
                </div>
                <p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{p.body}</p>
                {p.videoUrl ? (
                  <p style={{ margin: '8px 0 0', fontSize: 14 }}>
                    <a href={p.videoUrl} target="_blank" rel="noreferrer">
                      Open video link
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

const btn: CSSProperties = {
  padding: '10px 14px',
  minHeight: 44,
  borderRadius: 6,
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 15,
}
