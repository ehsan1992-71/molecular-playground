import { useEffect } from 'react'
import Header from './components/Header'
import DNASequenceInput from './components/DNASequenceInput'
import AnimationCanvas from './components/AnimationCanvas'
import ControlPanel from './components/ControlPanel'
import SequenceOutput from './components/SequenceOutput'
import NucleotideChart from './components/NucleotideChart'
import { useSimulationStore } from './store/useSimulationStore'

function App() {
  const isPlaying = useSimulationStore((state) => state.isPlaying)
  const speed = useSimulationStore((state) => state.speed)
  const advanceAnimation = useSimulationStore((state) => state.advanceAnimation)
  const attempts = useSimulationStore((state) => state.attempts)

  // این useEffect مثل یه موتور عمل می‌کنه
  // هر وقت isPlaying=true باشه، هر ثانیه یه قدم جلو می‌ره
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      advanceAnimation()
    }, speed)
    
    return () => clearInterval(interval)  // تمیزکاری هنگام توقف
  }, [isPlaying, speed, advanceAnimation])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <DNASequenceInput />
            <SequenceOutput />
            <NucleotideChart />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <AnimationCanvas />
            <ControlPanel />
          </div>
        </div>
        <p className="text-gray-400 text-sm">تعداد تلاش‌ها: {attempts}</p>
      </div>
    </div>
  )
}

export default App