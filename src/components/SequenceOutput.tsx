import { useSimulationStore } from '../store/useSimulationStore'
import { splitIntoCodons } from '../utils/transcription'

export default function SequenceOutput() {
  const mrnaSequence = useSimulationStore((state) => state.mrnaSequence)
  
  
  const codons = splitIntoCodons(mrnaSequence)
  
  const codonColors = [
    'text-emerald-300',
    'text-teal-300',
    'text-green-300',
    'text-lime-300',
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-emerald-400 mb-3">
        📋 mRNA ساخته شده
      </h2>
      
      {mrnaSequence ? (
        <div className="bg-gray-800 rounded-lg p-4">
          {/* نمایش کدون‌ها */}
          <p className="text-xl text-center font-mono font-bold flex flex-wrap justify-center gap-1">
            {codons.map((codon, i) => (
              <span key={i} className={codonColors[i % codonColors.length]}>
                {codon}
              </span>
            ))}
          </p>
          
          <div className="mt-3 text-xs text-gray-500 text-center">
            {mrnaSequence.length} نوکلئوتید | {codons.length} کدون
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500">
          <p>هنوز رونویسی انجام نشده است</p>
          <p className="text-sm mt-1">دکمه شروع را بزنید</p>
        </div>
      )}
    </div>
  )
}