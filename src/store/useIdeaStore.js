import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'
import { fetchTopicDescription, fetchTopicScript } from '../lib/gemini'

// Custom storage engine for Zustand using IndexedDB (idb-keyval)
const storage = {
  getItem: async (name) => {
    return (await idbGet(name)) || null
  },
  setItem: async (name, value) => {
    await idbSet(name, value)
  },
  removeItem: async (name) => {
    await idbDel(name)
  },
}

export const useIdeaStore = create(
  persist(
    (set, get) => ({
      // State
      currentResult: null,
      currentPhrase: '',
      library: [],
      history: [],
      resultsCache: {}, 
      nodeDescriptionsCache: {}, 
      scriptsCache: {}, // { label: scriptData }
      selectedNodeDescription: null,
      selectedNodeScript: null,
      isLoading: false,
      isExplaining: false,
      isScripting: false,
      explainingNodeId: null,
      error: null,
      activeView: 'explore',
      apiKey: '',
      showSettings: false,

      // Actions
      setCurrentResult: (result, phrase) => {
        const { resultsCache } = get()
        set({
          currentResult: result,
          currentPhrase: phrase,
          error: null,
          selectedNodeDescription: null,
          selectedNodeScript: null,
          resultsCache: { ...resultsCache, [phrase.toLowerCase().trim()]: result },
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false, isExplaining: false, isScripting: false, explainingNodeId: null }),
      setView: (view) => set({ activeView: view }),
      setApiKey: (apiKey) => set({ apiKey }),
      setShowSettings: (show) => set({ showSettings: show }),

      saveIdea: () => {
        const { currentResult, currentPhrase, library } = get()
        if (!currentResult || !currentPhrase) return
        const alreadySaved = library.some((i) => i.phrase === currentPhrase)
        if (alreadySaved) return
        const idea = {
          id: Date.now().toString(),
          phrase: currentPhrase,
          result: currentResult,
          savedAt: new Date().toISOString(),
        }
        set({ library: [idea, ...library] })
      },

      deleteIdea: (id) => {
        const { library } = get()
        set({ library: library.filter((i) => i.id !== id) })
      },

      addToHistory: (phrase) => {
        const { history } = get()
        const newHistory = [phrase, ...history.filter((h) => h !== phrase)].slice(0, 10)
        set({ history: newHistory })
      },

      loadIdeaFromLibrary: (idea) => {
        set({
          currentResult: idea.result,
          currentPhrase: idea.phrase,
          selectedNodeDescription: null,
          selectedNodeScript: null,
          activeView: 'explore',
        })
      },

      isIdeaSaved: () => {
        const { currentPhrase, library } = get()
        return library.some((i) => i.phrase === currentPhrase)
      },

      getCachedResult: (phrase) => {
        const { resultsCache } = get()
        return resultsCache[phrase.toLowerCase().trim()] || null
      },

      fetchNodeDescription: async (nodeId, label) => {
        const { currentPhrase, apiKey, nodeDescriptionsCache, isExplaining } = get()
        if (isExplaining || !apiKey) return
        if (nodeDescriptionsCache[label]) {
          set({ selectedNodeDescription: nodeDescriptionsCache[label] })
          window.dispatchEvent(new CustomEvent('idea-engine:tab-change', { detail: 'about' }))
          return
        }
        set({ isExplaining: true, explainingNodeId: nodeId })
        try {
          const data = await fetchTopicDescription(label, currentPhrase, apiKey)
          set({
            selectedNodeDescription: data,
            nodeDescriptionsCache: { ...nodeDescriptionsCache, [label]: data },
            isExplaining: false,
            explainingNodeId: null,
          })
          window.dispatchEvent(new CustomEvent('idea-engine:tab-change', { detail: 'about' }))
        } catch (err) {
          set({ error: err.message, isExplaining: false, explainingNodeId: null })
        }
      },

      fetchNodeScript: async (label) => {
        const { currentPhrase, apiKey, scriptsCache, isScripting } = get()
        if (isScripting || !apiKey) return
        if (scriptsCache[label]) {
          set({ selectedNodeScript: scriptsCache[label] })
          return
        }
        set({ isScripting: true })
        try {
          const data = await fetchTopicScript(label, currentPhrase, apiKey)
          set({
            selectedNodeScript: data,
            scriptsCache: { ...scriptsCache, [label]: data },
            isScripting: false,
          })
        } catch (err) {
          set({ error: err.message, isScripting: false })
        }
      },
    }),
    {
      name: 'idea-engine-storage',
      storage: storage,
      partialize: (state) => ({
        library: state.library,
        history: state.history,
        apiKey: state.apiKey,
        resultsCache: state.resultsCache,
        nodeDescriptionsCache: state.nodeDescriptionsCache,
        scriptsCache: state.scriptsCache,
      }),
    }
  )
)
