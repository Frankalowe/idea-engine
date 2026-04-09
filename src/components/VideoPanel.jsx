import { useState } from 'react'
import { Copy, Check, ArrowRight, Sparkles, List, Lightbulb } from 'lucide-react'
import { useIdeaStore } from '../store/useIdeaStore'

function TitlesTab({ titles = [] }) {
  const [copied, setCopied] = useState(null)

  const copy = (text, i) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div>
      {titles.map((title, i) => (
        <div
          key={i}
          className="title-card animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="title-num">#{i + 1}</span>
          <span className="title-text">{title}</span>
          <button className="title-copy" onClick={() => copy(title, i)} title="Copy title">
            {copied === i ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
          </button>
        </div>
      ))}
    </div>
  )
}

function OutlineTab({ outline }) {
  if (!outline) return null
  const { intro, points = [], cta } = outline

  return (
    <div>
      {/* Intro */}
      <div className="outline-section animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div className="outline-section-label intro">🎬 Intro / Hook</div>
        <p className="outline-text">{intro}</p>
      </div>

      {/* Points */}
      <div className="outline-section animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="outline-section-label points">📋 Key Points</div>
        {points.map((pt, i) => (
          <div key={i} className="outline-point">
            <div className="outline-point-num">{i + 1}</div>
            <div className="outline-point-content">
              <div className="outline-point-title">{pt.title}</div>
              <div className="outline-point-desc">{pt.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="outline-section animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="outline-section-label cta">🎯 Call to Action</div>
        <p className="outline-text">{cta}</p>
      </div>
    </div>
  )
}

function RelatedTab({ ideas = [] }) {
  const { apiKey, setCurrentResult, setLoading, setError, addToHistory, setView } = useIdeaStore()
  const { generateIdeaMap } = require('../lib/gemini')

  const handleClick = async (idea) => {
    if (!apiKey) return
    window.dispatchEvent(new CustomEvent('idea-engine:search', { detail: idea }))
  }

  return (
    <div className="related-grid">
      <p
        style={{
          fontSize: 11,
          color: 'var(--text-subtle)',
          marginBottom: 4,
          paddingLeft: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600,
        }}
      >
        Click to explore →
      </p>
      {ideas.map((idea, i) => (
        <button
          key={i}
          className="related-chip animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
          onClick={() => handleClick(idea)}
        >
          <span className="related-chip-icon">💡</span>
          <span style={{ flex: 1 }}>{idea}</span>
          <ArrowRight size={13} className="related-chip-arrow" />
        </button>
      ))}
    </div>
  )
}

export default function VideoPanel({ result }) {
  const [activeTab, setActiveTab] = useState('titles')

  const tabs = [
    { id: 'titles', label: 'Titles', icon: <Sparkles size={11} /> },
    { id: 'outline', label: 'Outline', icon: <List size={11} /> },
    { id: 'related', label: 'Related', icon: <Lightbulb size={11} /> },
  ]

  return (
    <div className="video-panel">
      <div className="video-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`vp-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="video-panel-body">
        {activeTab === 'titles' && <TitlesTab titles={result?.videoTitles} />}
        {activeTab === 'outline' && <OutlineTab outline={result?.outline} />}
        {activeTab === 'related' && <RelatedTab ideas={result?.relatedIdeas} />}
      </div>
    </div>
  )
}
