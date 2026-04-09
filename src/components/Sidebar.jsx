import { Compass, BookOpen, Clock, Zap } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'

export default function Sidebar() {
  const { activeView, setView, history } = useIdeaStore()

  const handleHistoryClick = (phrase) => {
    window.dispatchEvent(new CustomEvent('idea-engine:search', { detail: phrase }))
    setView('explore')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <div>
          <div className="sidebar-logo-text">Idea Engine</div>
          <div className="sidebar-logo-sub">YouTube Content AI</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button
          id="nav-explore"
          className={`sidebar-nav-item ${activeView === 'explore' ? 'active' : ''}`}
          onClick={() => setView('explore')}
        >
          <Compass size={16} className="nav-icon" />
          Explore
        </button>
        <button
          id="nav-library"
          className={`sidebar-nav-item ${activeView === 'library' ? 'active' : ''}`}
          onClick={() => setView('library')}
        >
          <BookOpen size={16} className="nav-icon" />
          My Library
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* History */}
      <div className="sidebar-section-label">
        <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
        Recent
      </div>
      <div className="sidebar-history">
        {history.length === 0 && (
          <div style={{ padding: '8px 22px', fontSize: 12, color: 'var(--text-subtle)' }}>
            No recent searches yet
          </div>
        )}
        {history.map((phrase, i) => (
          <button
            key={i}
            className="history-item"
            onClick={() => handleHistoryClick(phrase)}
            title={phrase}
          >
            <Zap size={10} style={{ flexShrink: 0, color: 'var(--primary-light)' }} />
            <span className="history-item-text">{phrase}</span>
          </button>
        ))}
      </div>

      {/* Bottom info */}
      <div className="sidebar-bottom">
        <div className="sidebar-nav-item w-full" style={{ opacity: 0.6, cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
             <span className="sidebar-logo-icon" style={{ width: 14, height: 14, fontSize: 8 }}>✓</span>
             Secured by Vercel
          </div>
        </div>
      </div>
    </aside>
  )
}
