import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'

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
      resultsCache: {}, // { phrase: result }
      isLoading: false,
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
          resultsCache: { ...resultsCache, [phrase.toLowerCase().trim()]: result },
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      setView: (view) => set({ activeView: view }),
      setApiKey: (apiKey) => set({ apiKey }),
      setShowSettings: (show) => set({ showSettings: show }),

      saveIdea: () => {
        const { currentResult, currentPhrase, library } = get()
        if (!currentResult || !currentPhrase) return

        // Prevent duplicates
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
    }),
    {
      name: 'idea-engine-storage',
      storage: storage, // Use the IndexedDB storage engine
      partialize: (state) => ({
        library: state.library,
        history: state.history,
        apiKey: state.apiKey,
        resultsCache: state.resultsCache, // Persist the AI results cache
      }),
    }
  )
)
