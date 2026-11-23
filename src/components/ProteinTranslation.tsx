import { FiActivity, FiInfo, FiZap } from 'react-icons/fi'
import { useSimulationStore } from '../store/useSimulationStore'
import { translateMRNA } from '../utils/translation'

export default function ProteinTranslation() {
  const mrnaSequence = useSimulationStore((state) => state.mrnaSequence)
  const items = translateMRNA(mrnaSequence)

  const aminoAcids = items.filter((item) => !item.isStop)
  const hasStart = items.length > 0
  const hasStop = items.some((item) => item.isStop)

  return (
    <section className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-[#111329] to-[#080b19] p-5 shadow-lg shadow-violet-950/10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-300">
            <FiActivity size={20} />
          </div>
          <div>
            <h2 className="font-bold text-violet-200">ترجمه و ساخت پروتئین</h2>
            <p className="mt-1 text-[10px] tracking-wider text-slate-500">
              TRANSLATION LAB
            </p>
          </div>
        </div>
        <FiZap className="text-violet-300" size={20} />
      </div>

      {!mrnaSequence ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.025] p-5 text-center">
          <FiInfo className="mx-auto mb-2 text-slate-500" size={22} />
          <p className="text-sm text-slate-300">
            ابتدا آزمایش رونویسی را اجرا کن.
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            پس از تولید mRNA، کدون‌ها بررسی و زنجیره آمینواسیدی نمایش داده می‌شود.
          </p>
        </div>
      ) : !hasStart ? (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="text-sm font-semibold text-amber-200">
            کدون شروع AUG پیدا نشد.
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-400">
            برای این توالی، ترجمه استاندارد از نخستین AUG آغاز نمی‌شود.
            توالی mRNA را بررسی کن یا DNA دیگری وارد کن.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="rounded-lg border border-violet-400/20 bg-violet-400/5 px-3 py-2">
              <span className="block text-[10px] text-slate-500">آمینواسیدها</span>
              <strong className="mt-1 block text-lg text-violet-200">
                {aminoAcids.length}
              </strong>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
              <span className="block text-[10px] text-slate-500">کدون پایان</span>
              <strong className={`mt-1 block text-sm ${hasStop ? 'text-emerald-300' : 'text-amber-300'}`}>
                {hasStop ? 'شناسایی شد' : 'وجود ندارد'}
              </strong>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 text-xs text-slate-400">کدون‌های mRNA</p>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {items.map((item, index) => (
                <div
                  key={`${item.codon}-${index}`}
                  title={item.aminoAcid}
                  className={`min-w-[64px] rounded-lg border p-2 text-center ${
                    item.isStop
                      ? 'border-rose-400/40 bg-rose-400/10'
                      : item.isStart
                        ? 'border-emerald-400/40 bg-emerald-400/10'
                        : 'border-violet-400/20 bg-violet-400/[0.06]'
                  }`}
                >
                  <span className={`block font-mono text-sm font-bold ${
                    item.isStop
                      ? 'text-rose-300'
                      : item.isStart
                        ? 'text-emerald-300'
                        : 'text-violet-200'
                  }`}>
                    {item.codon}
                  </span>
                  <span className="mt-1 block text-[9px] text-slate-400">
                    {item.symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="mb-3 text-xs text-slate-400">زنجیره آمینواسیدی</p>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {aminoAcids.map((item, index) => (
                <div
                  key={`${item.symbol}-${index}`}
                  className="grid min-w-[45px] place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-2"
                  title={item.aminoAcid}
                >
                  <span className="font-mono text-xs font-bold text-cyan-200">
                    {item.symbol}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              هر کدون، یک آمینواسید را مشخص می‌کند؛ کدون‌های پایان، سیگنال خاتمه ترجمه هستند و آمینواسیدی به زنجیره اضافه نمی‌کنند.
            </p>
          </div>

          {!hasStop && (
            <p className="mt-3 text-xs leading-6 text-amber-300/80">
              در بخش قابل‌خواندن این توالی، کدون پایان مشاهده نشد. ممکن است توالی ناقص باشد.
            </p>
          )}
        </>
      )}
    </section>
  )
}
