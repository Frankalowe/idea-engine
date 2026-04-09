import { useState } from 'react'
import { Search, BookOpen, Clock } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'
import IdeaCard from '../components/IdeaCard'

export default function LibraryView() {
  const { library } = useIdeaStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLibrary = library.filter((idea) =>
    idea.phrase.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="library-view animate-fade-in">
      <div className="library-header">
        <div>
          <h1 className="library-title">Saved Content Strategies</h1>
          <p className="library-count">
            {library.length} {library.length === 1 ? 'idea' : 'ideas'} in your engine
          </p>
        </div>

        <div className="library-search">
          <Search size={14} className="library-search-icon" />
          <input
            type="text"
            className="library-search-input"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="library-grid">
        {filteredLibrary.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '100px 0' }}>
            <div className="empty-state-icon">
              <BookOpen size={30} />
            </div>
            <h2 className="empty-state-title">Library is Empty</h2>
            <p className="empty-state-sub">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "Ideas you save from the Explore view will appear here for you to refine later."}
            </p>
          </div>
        ) : (
          filteredLibrary.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))
        )}
      </div>
    </div>
  )
}
