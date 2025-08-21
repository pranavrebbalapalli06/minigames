
import './App.css'
import RockPaperScissors from './games/RockPaperScissor/maingame.jsx'
import RPSResult from './games/RockPaperScissor/result.jsx'
import RPSRules from './games/RockPaperScissor/rules.jsx'
import EmojiGame from './games/EmojiGame/maingame.jsx'
import ERules from './games/EmojiGame/rules.jsx'
import EResult from './games/EmojiGame/result.jsx'
import Cards from './games/CardFlip/main.jsx'
import CRules from './games/CardFlip/rules.jsx'
import CResult from './games/CardFlip/result.jsx'
import MemoryMatrix from './games/MemoryMatrix/main.jsx'
import MMRules from './games/MemoryMatrix/rules.jsx'
import MMResult from './games/MemoryMatrix/result.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './games/Home/Home.jsx'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rock-paper-scissor" element={<RockPaperScissors />} />
        <Route path='/rock-paper-scissor/result' element={<RPSResult />} />
        <Route path='/rock-paper-scissor/rules' element={<RPSRules/>}/>


        <Route path="/emoji-game/rules" element={<ERules />} />
        <Route path="/emoji-game" element={<EmojiGame />} />
        <Route path="/emoji-game/result" element={<EResult />} />

        
        
       
        <Route path="/cards-game" element={<Cards />} />
        <Route path="/cards-game/rules" element={<CRules />} />
        <Route path="/cards-game/result" element={<CResult />} />
        
        <Route path="/memory-matrix" element={<MemoryMatrix />} />
        <Route path="/memory-matrix/rules" element={<MMRules/>} />
        <Route path="/memory-matrix/result" element={<MMResult/>} />
        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
