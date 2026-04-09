import { useState } from 'react'
import { ChevronRight, Info, Search } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'

export default function CategoryTree({ categories = [] }) {
  const [open, setOpen] = useState({})
  const { fetchNodeDescription, isExplaining, explainingNodeId } = useIdeaStore()

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleSubClick = (sub) => {
    // Sub-items trigger a new SEARCH
    window.dispatchEvent(new CustomEvent('idea-engine:search', { detail: sub }))
  }

  const handleDescribe = (e, cat) => {
    e.stopPropagation()
    // Categories trigger a DESCRIPTION fetch
    fetchNodeDescription(cat.id, cat.name)
  }

  return (
    <div className="category-tree" style={{ flex: 1 }}>
      <div className="panel-header">
        <span>🗂️</span>
        Categories
      </div>
      <div className="category-tree-body">
        {categories.map((cat, i) => {
          const isOpen = open[cat.id] !== false
          const loading = isExplaining && explainingNodeId === cat.id

          return (
            <div key={cat.id} className="cat-item animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div
                className="cat-header"
                onClick={() => toggle(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span
                  className="cat-dot"
                  style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}80` }}
                />
                <span className="cat-name" style={{ color: cat.color }}>
                  {cat.name}
                </span>
                
                {/* Describe Button */}
                <button 
                  className="icon-btn" 
                  onClick={(e) => handleDescribe(e, cat)}
                  title="Explain this topic"
                  disabled={isExplaining}
                  style={{ marginRight: 4, padding: '3px', borderRadius: '50%' }}
                >
                  {loading ? <span className="spinner" style={{ width: 10, height: 10 }} /> : <Info size={10} />}
                </button>

                <ChevronRight
                  size={13}
                  className={`cat-chevron ${isOpen ? 'open' : ''}`}
                />
              </div>
              
              {isOpen && cat.subcategories?.length > 0 && (
                <div className="cat-subs">
                  {cat.subcategories.map((sub, j) => (
                    <div
                      key={j}
                      className="cat-sub-item animate-fade-up"
                      style={{ color: cat.color + 'cc', animationDelay: `${j * 40}ms`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => handleSubClick(sub)}
                    >
                      <Search size={10} style={{ opacity: 0.5, flexShrink: 0 }} />
                      <span className="sub-text">{sub}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
