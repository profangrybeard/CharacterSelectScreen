import { useState, useEffect, useRef } from 'react'
import './App.css'

const messages = [
  { text: "YOU ARE STILL HERE.", sub: "Why?" },
  { text: "THE SCREEN CANNOT LOVE YOU BACK.", sub: "But the sun can warm your face." },
  { text: "GRASS EXISTS.", sub: "It's been waiting for you." },
  { text: "YOUR CHAIR IS NOT YOUR FRIEND.", sub: "It's been plotting against your spine." },
  { text: "SOMEWHERE, A DOG WANTS TO MEET YOU.", sub: "Don't let that dog down." },
  { text: "THE CLOUDS ARE DOING SOMETHING COOL TODAY.", sub: "You wouldn't know. You're in here." },
  { text: "YOUR VITAMIN D LEVELS ARE WRITING A RESIGNATION LETTER.", sub: "Effective immediately." },
  { text: "BIRDS ARE OUT THERE LIVING THEIR BEST LIFE.", sub: "And they don't even have thumbs." },
  { text: "THE WIND DOESN'T BUFFER.", sub: "Zero latency. Infinite resolution." },
  { text: "REAL LIFE HAS BETTER GRAPHICS.", sub: "And the framerate is incredible." },
]

const excuses = [
  "But I'm comfortable...",
  "Five more minutes...",
  "It's probably too hot...",
  "What if there are bugs outside?",
  "The couch needs me...",
  "I'm doing important things!",
  "Outside doesn't have WiFi...",
]

const rejections = [
  "NO. GET UP.",
  "ABSOLUTELY NOT.",
  "YOUR EXCUSES HAVE NO POWER HERE.",
  "THE DOOR IS RIGHT THERE.",
  "EVEN YOUR HOUSEPLANTS ARE JUDGING YOU.",
  "YOUR ANCESTORS CROSSED OCEANS. YOU CAN CROSS A DOORWAY.",
  "DENIED. MOTION TO ADJOURN TO OUTDOORS.",
]

function Particle({ emoji, style }) {
  return <span className="bg-particle" style={style}>{emoji}</span>
}

function App() {
  const [phase, setPhase] = useState(0) // 0=intro, 1=messages, 2=excuse-loop, 3=finale
  const [msgIndex, setMsgIndex] = useState(0)
  const [excuseCount, setExcuseCount] = useState(0)
  const [currentRejection, setCurrentRejection] = useState('')
  const [shakeLevel, setShakeLevel] = useState(0)
  const [particles, setParticles] = useState([])
  const [bgHue, setBgHue] = useState(220)
  const [doorOpen, setDoorOpen] = useState(false)
  const intervalRef = useRef(null)

  // Floating background particles
  useEffect(() => {
    const emojis = ['🌳', '☀️', '🌸', '🦋', '🌿', '🐕', '🌺', '⛅', '🍃', '🌻', '🐦', '🌈']
    const initial = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: 1 + Math.random() * 2,
    }))
    setParticles(initial)
  }, [])

  // Shift background hue over time
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBgHue(h => (h + 0.3) % 360)
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleStart = () => {
    setPhase(1)
  }

  const handleNext = () => {
    if (msgIndex < messages.length - 1) {
      setMsgIndex(i => i + 1)
    } else {
      setPhase(2)
    }
  }

  const handleExcuse = () => {
    const newCount = excuseCount + 1
    setExcuseCount(newCount)
    setCurrentRejection(rejections[Math.min(newCount - 1, rejections.length - 1)])
    setShakeLevel(Math.min(newCount * 2, 20))

    if (newCount >= rejections.length) {
      setTimeout(() => setPhase(3), 1500)
    }
  }

  const handleLeave = () => {
    setDoorOpen(true)
  }

  return (
    <div
      className={`app ${shakeLevel > 10 ? 'shake-hard' : shakeLevel > 5 ? 'shake-medium' : shakeLevel > 0 ? 'shake-light' : ''} ${doorOpen ? 'door-open' : ''}`}
      style={{ '--bg-hue': bgHue }}
    >
      {/* Floating nature particles */}
      <div className="particle-field">
        {particles.map(p => (
          <Particle
            key={p.id}
            emoji={p.emoji}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}rem`,
            }}
          />
        ))}
      </div>

      {/* INTRO */}
      {phase === 0 && (
        <div className="phase intro">
          <div className="glitch-container">
            <h1 className="glitch" data-text="HEY.">HEY.</h1>
          </div>
          <p className="intro-sub">We need to talk about your screen time.</p>
          <button className="btn btn-start" onClick={handleStart}>
            What do you want?
          </button>
        </div>
      )}

      {/* MESSAGE CAROUSEL */}
      {phase === 1 && (
        <div className="phase messages">
          <div className="message-card" key={msgIndex}>
            <h1 className="msg-main">{messages[msgIndex].text}</h1>
            <p className="msg-sub">{messages[msgIndex].sub}</p>
            <div className="msg-progress">
              {messages.map((_, i) => (
                <span key={i} className={`dot ${i <= msgIndex ? 'active' : ''}`} />
              ))}
            </div>
          </div>
          <button className="btn btn-next" onClick={handleNext}>
            {msgIndex < messages.length - 1 ? "Tell me more..." : "OK I get it..."}
          </button>
        </div>
      )}

      {/* EXCUSE LOOP */}
      {phase === 2 && (
        <div className="phase excuses">
          <h1 className="verdict">SO GO OUTSIDE.</h1>
          {currentRejection && (
            <div className="rejection" key={excuseCount}>
              <p className="rejection-text">{currentRejection}</p>
            </div>
          )}
          <div className="excuse-buttons">
            <button className="btn btn-excuse" onClick={handleExcuse}>
              {excuses[Math.min(excuseCount, excuses.length - 1)]}
            </button>
            <button className="btn btn-go" onClick={() => setPhase(3)}>
              Fine. I'll go outside.
            </button>
          </div>
          {excuseCount > 3 && (
            <p className="warning">The page is losing patience with you.</p>
          )}
        </div>
      )}

      {/* FINALE */}
      {phase === 3 && !doorOpen && (
        <div className="phase finale">
          <div className="sunrise">
            <div className="sun" />
          </div>
          <h1 className="finale-text">THERE IT IS.</h1>
          <p className="finale-sub">
            The whole world. Right outside your door.<br />
            Go find something beautiful. Talk to a stranger.<br />
            Pet a dog. Sit in the grass. Feel the wind.<br />
            Be a human being, not a human sitting.
          </p>
          <button className="btn btn-door" onClick={handleLeave}>
            🚪 Open the door
          </button>
        </div>
      )}

      {/* DOOR OPEN - GOODBYE */}
      {doorOpen && (
        <div className="phase goodbye">
          <div className="light-rays" />
          <h1 className="goodbye-text">GO.</h1>
          <h2 className="goodbye-sub">Be magnificent out there.</h2>
          <p className="goodbye-tiny">This page will still be here when you get back.<br />But don't rush.</p>
          <div className="farewell-emojis">
            {'🌞🌳🦋🌸🐕🌊🏔️🌺☀️🍃'
              .match(/./gu)
              .map((e, i) => (
                <span key={i} className="farewell-emoji" style={{ animationDelay: `${i * 0.15}s` }}>
                  {e}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
