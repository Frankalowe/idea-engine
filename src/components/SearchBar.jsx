import { useState, useEffect, useRef } from 'react'
import { Search, Bookmark, BookmarkCheck, AlertCircle } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'
import { generateIdeaMap } from '../lib/gemini'

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const {
    apiKey,
    isLoading,
    error,
    currentPhrase,
    setCurrentResult,
    setLoading,
    setError,
    addToHistory,
    setShowSettings,
    saveIdea,
    library,
    getCachedResult,
  } = useIdeaStore()

  const isSaved = library.some((i) => i.phrase === currentPhrase)

  const handleSearch = async (phrase) => {
    const q = (phrase || inputValue).trim()
    if (!q) return

    // 1. Check Cache first
    const cached = getCachedResult(q)
    if (cached) {
      setCurrentResult(cached, q)
      addToHistory(q)
      return // Instant return!
    }

    if (!apiKey) {
      setShowSettings(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await generateIdeaMap(q, apiKey)
      setCurrentResult(result, q)
      addToHistory(q)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Listen for history clicks
  useEffect(() => {
    const handler = (e) => {
      setInputValue(e.detail)
      handleSearch(e.detail)
    }
    window.addEventListener('idea-engine:search', handler)
    return () => window.removeEventListener('idea-engine:search', handler)
  }, [apiKey])

  // Cmd/Ctrl+K focus shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="search-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={16} className="search-icon" />
          <input
            ref={inputRef}
            id="search-input"
            className="search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a phrase or topic — e.g. morning routines for productivity..."
            disabled={isLoading}
            autoComplete="off"
          />
          <div className="search-actions">
            <span className="search-kbd">⌘ Enter</span>
            <button
              id="btn-generate"
              className="search-btn"
              onClick={() => handleSearch()}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Thinking…
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save button */}
        {currentPhrase && (
          <button
            id="btn-save"
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={saveIdea}
            disabled={isSaved}
            title={isSaved ? 'Saved to library' : 'Save to library'}
          >
            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      {error && (
        <div className="error-bar" style={{ marginTop: 10 }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  )
}
