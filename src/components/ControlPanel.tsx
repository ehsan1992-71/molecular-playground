import { FiPlay, FiPause, FiChevronRight, FiRotateCcw } from 'react-icons/fi'
import { useSimulationStore } from '../store/useSimulationStore'

export default function ControlPanel() {
  // داده‌ها
  const errorMessage = useSimulationStore((state) => state.errorMessage)
  const isPlaying = useSimulationStore((state) => state.isPlaying)
  const animationStep = useSimulationStore((state) => state.animationStep)
  const progress = useSimulationStore((state) => state.progress)
  const speed = useSimulationStore((state) => state.speed)
  
  // action ها
  const startTranscription = useSimulationStore((state) => state.startTranscription)
  const pauseTranscription = useSimulationStore((state) => state.pauseTranscription)
  const stepForward = useSimulationStore((state) => state.stepForward)
  const reset = useSimulationStore((state) => state.reset)
  const setSpeed = useSimulationStore((state) => state.setSpeed)

  const isIdle = animationStep === 'IDLE'
  const isDone = animationStep === 'DONE'
  const hasError = errorMessage !== ''

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-cyan-400 mb-3">
        🎮 کنترل پنل
      </h2>
      
      {/* نوار پیشرفت */}
      <div className="mb-4 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mb-3">{progress}% تکمیل</p>
      
      {/* دکمه‌ها */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* دکمه شروع/توقف */}
        {isPlaying ? (
          <button onClick={pauseTranscription}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 
                      text-white rounded-lg transition-colors font-semibold">
            <FiPause /> توقف
          </button>
        ) : (
          <button onClick={startTranscription} disabled={hasError || isDone}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 
                      text-white rounded-lg transition-colors font-semibold
                      disabled:opacity-50 disabled:cursor-not-allowed">
            <FiPlay /> {isDone ? 'پایان' : 'شروع'}
          </button>
        )}
        
        {/* دکمه مرحله بعد */}
        <button onClick={stepForward} disabled={isDone || hasError}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                    text-gray-300 rounded-lg transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed">
          <FiChevronRight /> مرحله بعد
        </button>
        
        {/* دکمه بازنشانی */}
        <button onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                    text-gray-300 rounded-lg transition-colors">
          <FiRotateCcw /> بازنشانی
        </button>
        
        {/* تنظیم سرعت */}
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
          <span>سرعت:</span>
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 
                      text-gray-300 focus:outline-none focus:border-cyan-500">
            <option value="1500">۰.۵x</option>
            <option value="1000">۱x</option>
            <option value="500">۲x</option>
          </select>
        </div>
      </div>
      
      {/* وضعیت فعلی */}
      <div className="mt-3 text-xs text-gray-500">
        وضعیت: {' '}
        <span className="text-cyan-400 font-semibold">
          {isIdle && 'آماده'}
          {animationStep === 'UNWINDING' && 'باز شدن مارپیچ DNA'}
          {animationStep === 'TRANSCRIBING' && 'در حال رونویسی'}
          {isDone && 'پایان رونویسی'}
        </span>
      </div>
    </div>
  )
}