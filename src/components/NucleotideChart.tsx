import { useSimulationStore } from '../store/useSimulationStore'
import { calculateNucleotidePercentages } from '../utils/transcription'
import type { RNANucleotide } from '../utils/transcription'

export default function NucleotideChart() {
  const mrnaSequence = useSimulationStore((state) => state.mrnaSequence)
  
  const percentages = calculateNucleotidePercentages(mrnaSequence)
  
  const bases: { name: RNANucleotide; color: string; textColor: string }[] = [
    { name: 'A', color: 'bg-blue-500', textColor: 'text-blue-400' },
    { name: 'U', color: 'bg-green-500', textColor: 'text-green-400' },
    { name: 'C', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { name: 'G', color: 'bg-red-500', textColor: 'text-red-400' },
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-purple-400 mb-3">
        📊 ترکیب نوکلئوتیدی
      </h2>
      
      {mrnaSequence ? (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-center gap-4 items-end" style={{ minHeight: '150px' }}>
            {bases.map((base) => (
              <div key={base.name} className="text-center flex flex-col items-center">
                <span className={`text-xs ${base.textColor} mb-1 font-bold`}>
                  {percentages[base.name]}%
                </span>
                <div 
                  className={`w-10 ${base.color} rounded-t-md transition-all duration-500`}
                  style={{ 
                    height: `${Math.max(percentages[base.name] * 1.5, 4)}px`,
                    opacity: percentages[base.name] > 0 ? 0.9 : 0.2
                  }}
                />
                <span className={`text-xs ${base.textColor} mt-1 font-bold`}>
                  {base.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500" 
             style={{ minHeight: '200px' }}>
          <p>نمودار درصد بازهای mRNA</p>
          <p className="text-sm mt-1">پس از رونویسی نمایش داده می‌شود</p>
          
          <div className="flex justify-center gap-4 mt-4">
            {bases.map((base) => (
              <div key={base.name} className="text-center">
                <div className={`w-4 h-20 ${base.color} rounded-full mx-auto opacity-30`}></div>
                <span className={`text-xs ${base.textColor} mt-1 block`}>{base.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}