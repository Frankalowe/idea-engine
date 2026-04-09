import { useIdeaStore } from './store/useIdeaStore'
import Sidebar from './components/Sidebar'
import ExploreView from './views/ExploreView'
import LibraryView from './views/LibraryView'

export default function App() {
  const { activeView } = useIdeaStore()

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {activeView === 'explore' ? <ExploreView /> : <LibraryView />}
      </main>
    </div>
  )
}
