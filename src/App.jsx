import { useState } from 'react'
import './App.css'

const celebrations = [
  'Nice!',
  'Keep going!',
  'Awesome!',
  'Unstoppable!',
  'Legend!',
  'On fire!',
  'Incredible!',
  'Wow!',
  'Superb!',
  'Magnificent!',
]

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [particles, setParticles] = useState([])

  const handleClick = () => {
    const newCount = count + 1
    setCount(newCount)
    setMessage(celebrations[Math.floor(Math.random() * celebrations.length)])

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      emoji: ['🎉', '🎊', '⭐', '🔥', '✨', '💥'][Math.floor(Math.random() * 6)],
      x: (Math.random() - 0.5) * 200,
      y: -(Math.random() * 150 + 50),
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 800)
  }

  return (
    <div className="app">
      <h1>Click Celebration Test</h1>
      <p className="subtitle">Testing that everything works</p>

      <div className="button-area">
        <div className="particle-container">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{ '--x': `${p.x}px`, '--y': `${p.y}px` }}
            >
              {p.emoji}
            </span>
          ))}
        </div>

        <button className="celebrate-btn" onClick={handleClick}>
          Click Me!
        </button>
      </div>

      <div className="count">
        <span className="count-number">{count}</span>
        <span className="count-label">clicks</span>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="history">
        {count > 0 && (
          <p>
            {count >= 50
              ? 'You are a clicking machine.'
              : count >= 20
                ? 'Seriously committed.'
                : count >= 10
                  ? 'Double digits!'
                  : count >= 5
                    ? 'Getting warmed up...'
                    : 'Just getting started.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
