
import './App.css'
import Chat from './components/chat/chat'
import UniverseBackground from './components/UniverseBackground'

function App() {

  return (
 <div className="min-h-screen text-white">
      {/* Background mounted once */}
      <UniverseBackground />

      {/* Your app content always comes on top */}
      <div className="relative z-10">
        {/* <header className="p-6 text-center text-3xl font-bold">
          <ExpressGPTLogo />
        </header> */}

        <main className="">
          <Chat/>
        </main>
      </div>
    </div>
  )
}

export default App
