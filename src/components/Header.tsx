import { FiActivity, FiGithub, FiHexagon } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-5">
      <div className="flex items-center gap-3">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.07] shadow-[0_0_30px_rgba(34,211,238,0.08)]">
          <FiHexagon className="absolute h-9 w-9 text-cyan-400/40" />
          <FiActivity className="h-6 w-6 text-cyan-300" />
        </div>

        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
            Molecular Playground
          </h1>

          <p className="mt-1 text-[10px] tracking-[0.16em] text-slate-500 sm:text-xs">
            MOLECULAR BIOLOGY · INTERACTIVE LAB
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-semibold tracking-wider text-emerald-300">
            LAB ONLINE
          </span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-2 text-slate-400">
          <FiGithub className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
