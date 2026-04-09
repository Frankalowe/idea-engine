import { useState, useEffect } from 'react'
import { Copy, Check, ArrowRight, Sparkles, List, Lightbulb, Info, Zap, Scroll, Video, MessageSquare } from 'lucide-react'
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
        <div key={i} className="title-card animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
          <span className="title-num">#{i + 1}</span>
          <span className="title-text">{title}</span>
          <button className="title-copy" onClick={() => copy(title, i)}>
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
      <div className="outline-section animate-fade-up">
        <div className="outline-section-label intro">🎬 Intro / Hook</div>
        <p className="outline-text">{intro}</p>
      </div>
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
      <div className="outline-section animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="outline-section-label cta">🎯 Call to Action</div>
        <p className="outline-text">{cta}</p>
      </div>
    </div>
  )
}

function AboutTab() {
  const { selectedNodeDescription, isExplaining } = useIdeaStore()

  if (isExplaining) {
    return (
      <div className="empty-state" style={{ padding: '20px 0' }}>
        <div className="spinner" style={{ width: 24, height: 24, borderTopColor: 'var(--primary)' }} />
        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>Analyzing topic strategy...</p>
      </div>
    )
  }

  if (!selectedNodeDescription) {
    return (
      <div className="empty-state" style={{ padding: '20px 0' }}>
        <div className="empty-state-icon" style={{ width: 40, height: 40, fontSize: 18 }}>💡</div>
        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>Click any node in the map to see a detailed expert strategy.</p>
      </div>
    )
  }

  const { topic, description, expertTips, angles } = selectedNodeDescription

  return (
    <div className="about-tab-content animate-fade-up">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', marginBottom: 4 }}>Analyzing</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{topic}</h3>
        <p className="outline-text" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{description}</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="outline-section-label points" style={{ fontSize: 10 }}>Expert Strategy Tips</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {expertTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>
              <Zap size={12} style={{ color: 'var(--cat-3)', marginTop: 3, flexShrink: 0 }} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="outline-section-label intro" style={{ fontSize: 10 }}>Unique Content Angles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {angles.map((angle, i) => (
            <div key={i} style={{ padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{angle.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.4 }}>{angle.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScriptTab() {
  const { selectedNodeDescription, selectedNodeScript, isScripting, fetchNodeScript } = useIdeaStore()
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (selectedNodeDescription?.topic) {
      fetchNodeScript(selectedNodeDescription.topic)
    }
  }

  const handleCopy = () => {
    if (!selectedNodeScript) return
    const text = `TITLE: ${selectedNodeScript.title}\n\nHOOK:\n${selectedNodeScript.hook}\n\n` + 
      selectedNodeScript.segments.map(s => `${s.title.toUpperCase()}\n[Visual: ${s.visualCue}]\n${s.content}`).join('\n\n') + 
      `\n\nOUTRO:\n${selectedNodeScript.outro}`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isScripting) {
    return (
      <div className="empty-state" style={{ padding: '20px 0' }}>
        <div className="spinner" style={{ width: 24, height: 24, borderTopColor: 'var(--primary)' }} />
        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>Writing full script transcript...</p>
      </div>
    )
  }

  if (!selectedNodeDescription) {
    return (
      <div className="empty-state" style={{ padding: '20px 0' }}>
        <div className="empty-state-icon">📄</div>
        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>Select a topic on the map first to generate a script.</p>
      </div>
    )
  }

  if (!selectedNodeScript) {
    return (
      <div className="empty-state" style={{ padding: '20px 0' }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Ready to write?</h4>
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 12 }}>I'll generate a full conversational script for "{selectedNodeDescription.topic}" with visual cues.</p>
        <button className="search-btn" onClick={handleGenerate} style={{ padding: '8px 16px', fontSize: 12 }}>
          <Scroll size={14} style={{ marginRight: 6 }} />
          Generate Full Script
        </button>
      </div>
    )
  }

  return (
    <div className="script-tab-content animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-light)' }}>Video Script Draft</h3>
        <button className="copy-all-btn" onClick={handleCopy}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>

      <div className="script-scroll-area">
        <div className="script-block hook">
          <div className="script-label"><Video size={11} /> HOOK</div>
          <p className="script-text">{selectedNodeScript.hook}</p>
        </div>

        {selectedNodeScript.segments.map((seg, i) => (
          <div key={i} className="script-segment">
            <div className="script-segment-header">
              <span className="script-segment-title">{seg.title}</span>
              <span className="script-cue">Visual: {seg.visualCue}</span>
            </div>
            <p className="script-text">{seg.content}</p>
          </div>
        ))}

        <div className="script-block outro">
          <div className="script-label"><MessageSquare size={11} /> OUTRO / CTA</div>
          <p className="script-text">{selectedNodeScript.outro}</p>
        </div>
      </div>
    </div>
  )
}

function RelatedTab({ ideas = [] }) {
  const { apiKey } = useIdeaStore()
  const handleClick = (idea) => {
    if (!apiKey) {
      window.dispatchEvent(new CustomEvent('idea-engine:show-settings'))
      return
    }
    window.dispatchEvent(new CustomEvent('idea-engine:search', { detail: idea }))
  }

  return (
    <div className="related-grid">
      <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Explore Related →</p>
      {ideas.map((idea, i) => (
        <button key={i} className="related-chip animate-fade-up" style={{ animationDelay: `${i * 60}ms` }} onClick={() => handleClick(idea)}>
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

  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail)
    window.addEventListener('idea-engine:tab-change', handler)
    return () => window.removeEventListener('idea-engine:tab-change', handler)
  }, [])

  const tabs = [
    { id: 'about', label: 'About', icon: <Info size={11} /> },
    { id: 'script', label: 'Script', icon: <Scroll size={11} /> },
    { id: 'titles', label: 'Titles', icon: <Sparkles size={11} /> },
    { id: 'outline', label: 'Outline', icon: <List size={11} /> },
    { id: 'related', label: 'Related', icon: <Lightbulb size={11} /> },
  ]

  return (
    <div className="video-panel">
      <div className="video-panel-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`vp-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="video-panel-body">
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'script' && <ScriptTab />}
        {activeTab === 'titles' && <TitlesTab titles={result?.videoTitles} />}
        {activeTab === 'outline' && <OutlineTab outline={result?.outline} />}
        {activeTab === 'related' && <RelatedTab ideas={result?.relatedIdeas} />}
      </div>
    </div>
  )
}
