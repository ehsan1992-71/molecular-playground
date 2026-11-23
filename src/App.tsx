import { useEffect } from 'react'
import Header from './components/Header'
import DNASequenceInput from './components/DNASequenceInput'
import AnimationCanvas from './components/AnimationCanvas'
import ControlPanel from './components/ControlPanel'
import SequenceOutput from './components/SequenceOutput'
import NucleotideChart from './components/NucleotideChart'
import ProteinTranslation from './components/ProteinTranslation'
import { useSimulationStore } from './store/useSimulationStore'
import './App.css'

function App() {
  const isPlaying = useSimulationStore((state) => state.isPlaying)
  const speed = useSimulationStore((state) => state.speed)
  const advanceAnimation = useSimulationStore((state) => state.advanceAnimation)

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      advanceAnimation()
    }, speed)

    return () => window.clearInterval(interval)
  }, [isPlaying, speed, advanceAnimation])

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="app-container">
        <Header />

        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">
              <span className="status-dot" />
              VIRTUAL BIOLOGY LABORATORY
            </span>

            <h2>
              دنیای مولکول‌ها را
              <span> کشف کن.</span>
            </h2>

            <p>
              رونویسی DNA را به‌صورت تعاملی بررسی کن و مراحل تشکیل RNA را
              قدم‌به‌قدم مشاهده کن.
            </p>
          </div>

          <div className="intro-badge">
            <span className="badge-orbit">◎</span>
            <div>
              <strong>MOLECULAR LAB</strong>
              <span>Interactive simulation</span>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <aside className="dashboard-sidebar">
            <div className="section-heading">
              <span className="section-index">01</span>
              <div>
                <h3>ورودی‌های آزمایش</h3>
                <p>Experiment inputs</p>
              </div>
            </div>

            <DNASequenceInput />
            <SequenceOutput />
            <NucleotideChart />
            <ProteinTranslation />

            <div className="science-note">
              <span className="note-icon">✳</span>
              <div>
                <strong>نکته علمی</strong>
                <p>
                  در رونویسی، RNA پلی‌مراز با استفاده از رشته الگوی DNA،
                  یک رشته RNA مکمل می‌سازد.
                </p>
              </div>
            </div>
          </aside>

          <section className="simulation-workspace">
            <div className="workspace-heading">
              <div>
                <span className="workspace-kicker">LIVE SIMULATION</span>
                <h3>استودیوی رونویسی مولکولی</h3>
              </div>

              <span className="live-indicator">
                <span />
                REAL-TIME
              </span>
            </div>

            <div className="simulation-stage">
              <div className="stage-grid" />
              <div className="stage-glow" />

              <div className="stage-corner corner-tl" />
              <div className="stage-corner corner-tr" />
              <div className="stage-corner corner-bl" />
              <div className="stage-corner corner-br" />

              <div className="stage-label stage-label-top">
                <span className="label-dot cyan-dot" />
                DNA TRANSCRIPTION
              </div>

              <AnimationCanvas />

              <div className="stage-caption">
                <span className="caption-line" />
                <span>MOLECULAR VISUALIZATION ENGINE</span>
                <span className="caption-line" />
              </div>
            </div>

            <div className="control-section">
              <div className="section-heading control-heading">
                <span className="section-index">02</span>
                <div>
                  <h3>کنترل آزمایش</h3>
                  <p>Simulation controls</p>
                </div>
              </div>

              <ControlPanel />
            </div>

            <footer className="app-footer">
              <span className="footer-mark">M</span>
              <span>MOLECULAR BIOLOGY PLAYGROUND</span>
              <span className="footer-divider">/</span>
              <span className="footer-muted">EXPLORE · SIMULATE · LEARN</span>
            </footer>
          </section>
        </section>
      </div>
    </main>
  )
}

export default App
