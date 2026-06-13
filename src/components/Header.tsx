// ۱. import کردن آیکون از کتابخونه react-icons
import { FiDroplet } from 'react-icons/fi'

// ۲. تعریف کامپوننت
export default function Header() {
  // ۳. return یعنی چی توی صفحه نشون بده
  return (
    // ۴. header یعنی بالاترین بخش صفحه
    <header className="text-center border-b border-gray-800 pb-6">
      
      {/* ۵. div برای چیدن آیکون و عنوان کنار هم */}
      <div className="flex items-center justify-center gap-3 mb-2">
        
        {/* ۶. آیکون قطره */}
        <FiDroplet className="text-4xl text-cyan-400" />
        
        {/* ۷. عنوان اصلی با گرادیانت رنگی */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Molecular Biology Playground
        </h1>
        
      </div>
      
      {/* ۸. زیرعنوان */}
      <p className="text-gray-400 text-lg">
        شبیه‌ساز تعاملی فرآیندهای زیست مولکولی — رونویسی DNA به mRNA
      </p>
      
    </header>
  )
}