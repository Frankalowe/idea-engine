import SearchBar from '../components/SearchBar'
import MindMap from '../components/MindMap'
import CategoryTree from '../components/CategoryTree'
import VideoPanel from '../components/VideoPanel'
import { useIdeaStore } from '../store/useIdeaStore'

export default function ExploreView() {
  const { currentResult, currentPhrase, isLoading } = useIdeaStore()

  return (
    <div className="explore-view">
      <SearchBar />

      <div className="explore-canvas">
        {!currentResult && !isLoading ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">💡</div>
            <h2 className="empty-state-title">Your Content Engine Awaits</h2>
            <p className="empty-state-sub">
              Enter a phrase or topic above, and the AI will map out a full YouTube strategy with titles, outlines, and categories.
            </p>
            <div className="empty-examples">
              {[
                'Productivity habits for creators',
                'Deep dive into minimalist tech',
                'Cooking healthy meals in 15 mins',
                'The future of autonomous flight',
              ].map((ex) => (
                <button
                  key={ex}
                  className="example-chip"
                  onClick={() => window.dispatchEvent(new CustomEvent('idea-engine:search', { detail: ex }))}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mind-map-section animate-fade-in">
              <div className="mind-map-container">
                <div className="mind-map-label">
                  <span />
                  Strategy Map: {currentPhrase}
                </div>
                <MindMap mindMap={currentResult?.mindMap} />
              </div>

              <div className="bottom-panels">
                <div className="category-tree" style={{ flex: 1, minHeight: 0 }}>
                  <CategoryTree categories={currentResult?.categories} />
                </div>
                <div className="video-panel" style={{ flex: 1.5, minHeight: 0 }}>
                  <VideoPanel result={currentResult} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
