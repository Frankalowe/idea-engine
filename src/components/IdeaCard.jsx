import { Calendar, Trash2, ExternalLink } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'

export default function IdeaCard({ idea }) {
  const { deleteIdea, loadIdeaFromLibrary } = useIdeaStore()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="idea-card animate-fade-up" onClick={() => loadIdeaFromLibrary(idea)}>
      <div className="idea-card-phrase">{idea.phrase}</div>
      <div className="idea-card-cats">
        {idea.result.categories.slice(0, 3).map((cat, i) => (
          <span
            key={i}
            className="idea-cat-tag"
            style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
          >
            {cat.icon} {cat.name}
          </span>
        ))}
        {idea.result.categories.length > 3 && (
          <span className="idea-cat-tag" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-subtle)' }}>
            +{idea.result.categories.length - 3}
          </span>
        )}
      </div>
      <div className="idea-card-footer">
        <div className="idea-card-date">
          <Calendar size={12} />
          {formatDate(idea.savedAt)}
        </div>
        <div className="idea-card-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              loadIdeaFromLibrary(idea)
            }}
            title="Open idea"
          >
            <ExternalLink size={14} />
          </button>
          <button
            className="icon-btn danger"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Delete this idea from your library?')) {
                deleteIdea(idea.id)
              }
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
