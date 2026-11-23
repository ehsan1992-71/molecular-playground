import { useSimulationStore } from '../store/useSimulationStore'

export default function DNASequenceInput() {
  const sequence = useSimulationStore((state) => state.dnaSequence)
  const errorMessage = useSimulationStore((state) => state.errorMessage)
  const setDNASequence = useSimulationStore((state) => state.setDNASequence)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-cyan-400 mb-3">
        🧬 توالی DNA
      </h2>

      <label className="block text-sm text-gray-400 mb-2">
        رشته DNA خود را وارد کنید (A, T, C, G):
      </label>

      <input
        type="text"
        value={sequence}
        onChange={(e) => setDNASequence(e.target.value)}
        className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-lg tracking-widest text-center font-bold"
        placeholder="مثال: ATCTGG"
        maxLength={30}
      />

      {errorMessage && (
        <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
      )}

      <p className="text-gray-500 text-xs mt-2 text-right">
        {sequence.length} / 30 نوکلئوتید
      </p>
    </div>
  )
}
