
import './App.css';
import UniverseBackground from './components/UniverseBackground';
import Chat from './pages/Chats';

function App() {

  return (
 <div className="min-h-screen text-white bg-black/40">
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
