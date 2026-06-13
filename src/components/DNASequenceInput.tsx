import { useState } from 'react'

export default function DNASequenceInput() {
  // state محلی برای نگه‌داری مقدار ورودی
  const [sequence, setSequence] = useState('ATGCGTACC')
  const [error, setError] = useState('')

  // تابعی که هر بار کاربر تایپ می‌کنه صدا زده میشه
  const handleChange = (value: string) => {
    const upperValue = value.toUpperCase()
    const valid = /^[ATCG]*$/.test(upperValue)
    
    if (!valid) {
      setError('فقط حروف A, T, C, G مجاز هستند')
    } else if (upperValue.length > 30) {
      setError('حداکثر ۳۰ نوکلئوتید')
    } else {
      setError('')
    }
    
    setSequence(upperValue)
  }

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
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-3 
                   focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
                   text-lg tracking-widest text-center font-bold"
        placeholder="مثال: ATGCGTACC"
        maxLength={30}
      />
      
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
      
      <p className="text-gray-500 text-xs mt-2 text-right">
        {sequence.length} / ۳۰ نوکلئوتید
      </p>
    </div>
  )
}