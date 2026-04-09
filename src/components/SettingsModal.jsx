import { useState } from 'react'
import { X, Key, ExternalLink } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'

export default function SettingsModal() {
  const { apiKey, setApiKey, showSettings, setShowSettings } = useIdeaStore()
  const [tempKey, setTempKey] = useState(apiKey)

  if (!showSettings) return null

  const handleSave = () => {
    setApiKey(tempKey)
    setShowSettings(false)
  }

  return (
    <div className="modal-overlay animate-fade-in" onClick={() => setShowSettings(false)}>
      <div className="modal-panel animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowSettings(false)}>
          <X size={18} />
        </button>

        <div className="modal-title">AI Engine Settings</div>
        <p className="modal-sub">
          The Idea Engine uses Google Gemini to generate content strategies. Enter your API key below to get started.
        </p>

        <div className="modal-field">
          <label className="modal-label">Gemini API Key</label>
          <div className="modal-input-wrapper" style={{ position: 'relative' }}>
            <Key
              size={14}
              style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-subtle)' }}
            />
            <input
              type="password"
              className="modal-input"
              style={{ paddingLeft: 38 }}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste your API key here..."
            />
          </div>
          <div className="modal-hint">
            Don't have a key? Get one for free at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio <ExternalLink size={10} style={{ display: 'inline' }} />
            </a>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setShowSettings(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
