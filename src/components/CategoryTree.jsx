import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

export default function CategoryTree({ categories = [], onCategoryClick }) {
  const [open, setOpen] = useState({})

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="category-tree" style={{ flex: 1 }}>
      <div className="panel-header">
        <span>🗂️</span>
        Categories
      </div>
      <div className="category-tree-body">
        {categories.map((cat, i) => {
          const isOpen = open[cat.id] !== false // default open
          return (
            <div key={cat.id} className="cat-item animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div
                className="cat-header"
                onClick={() => {
                  toggle(cat.id)
                  onCategoryClick?.(cat.id)
                }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span
                  className="cat-dot"
                  style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}80` }}
                />
                <span className="cat-name" style={{ color: cat.color }}>
                  {cat.name}
                </span>
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
                      style={{ color: cat.color + 'cc', animationDelay: `${j * 40}ms` }}
                    >
                      {sub}
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
