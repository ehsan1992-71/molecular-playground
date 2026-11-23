export type AminoAcid = {
  name: string
  symbol: string
}

export type TranslationItem = {
  codon: string
  aminoAcid: string
  symbol: string
  isStart: boolean
  isStop: boolean
}

export const GENETIC_CODE: Record<string, AminoAcid | null> = {
  UUU: { name: 'فنیل‌آلانین', symbol: 'Phe' },
  UUC: { name: 'فنیل‌آلانین', symbol: 'Phe' },
  UUA: { name: 'لوسین', symbol: 'Leu' },
  UUG: { name: 'لوسین', symbol: 'Leu' },

  UCU: { name: 'سرین', symbol: 'Ser' },
  UCC: { name: 'سرین', symbol: 'Ser' },
  UCA: { name: 'سرین', symbol: 'Ser' },
  UCG: { name: 'سرین', symbol: 'Ser' },

  UAU: { name: 'تیروزین', symbol: 'Tyr' },
  UAC: { name: 'تیروزین', symbol: 'Tyr' },
  UAA: null,
  UAG: null,

  UGU: { name: 'سیستئین', symbol: 'Cys' },
  UGC: { name: 'سیستئین', symbol: 'Cys' },
  UGA: null,
  UGG: { name: 'تریپتوفان', symbol: 'Trp' },

  CUU: { name: 'لوسین', symbol: 'Leu' },
  CUC: { name: 'لوسین', symbol: 'Leu' },
  CUA: { name: 'لوسین', symbol: 'Leu' },
  CUG: { name: 'لوسین', symbol: 'Leu' },

  CCU: { name: 'پرولین', symbol: 'Pro' },
  CCC: { name: 'پرولین', symbol: 'Pro' },
  CCA: { name: 'پرولین', symbol: 'Pro' },
  CCG: { name: 'پرولین', symbol: 'Pro' },

  CAU: { name: 'هیستیدین', symbol: 'His' },
  CAC: { name: 'هیستیدین', symbol: 'His' },
  CAA: { name: 'گلوتامین', symbol: 'Gln' },
  CAG: { name: 'گلوتامین', symbol: 'Gln' },

  CGU: { name: 'آرژینین', symbol: 'Arg' },
  CGC: { name: 'آرژینین', symbol: 'Arg' },
  CGA: { name: 'آرژینین', symbol: 'Arg' },
  CGG: { name: 'آرژینین', symbol: 'Arg' },

  AUU: { name: 'ایزولوسین', symbol: 'Ile' },
  AUC: { name: 'ایزولوسین', symbol: 'Ile' },
  AUA: { name: 'ایزولوسین', symbol: 'Ile' },
  AUG: { name: 'متیونین', symbol: 'Met' },

  ACU: { name: 'ترئونین', symbol: 'Thr' },
  ACC: { name: 'ترئونین', symbol: 'Thr' },
  ACA: { name: 'ترئونین', symbol: 'Thr' },
  ACG: { name: 'ترئونین', symbol: 'Thr' },

  AAU: { name: 'آسپاراژین', symbol: 'Asn' },
  AAC: { name: 'آسپاراژین', symbol: 'Asn' },
  AAA: { name: 'لیزین', symbol: 'Lys' },
  AAG: { name: 'لیزین', symbol: 'Lys' },

  AGU: { name: 'سرین', symbol: 'Ser' },
  AGC: { name: 'سرین', symbol: 'Ser' },
  AGA: { name: 'آرژینین', symbol: 'Arg' },
  AGG: { name: 'آرژینین', symbol: 'Arg' },

  GUU: { name: 'والین', symbol: 'Val' },
  GUC: { name: 'والین', symbol: 'Val' },
  GUA: { name: 'والین', symbol: 'Val' },
  GUG: { name: 'والین', symbol: 'Val' },

  GCU: { name: 'آلانین', symbol: 'Ala' },
  GCC: { name: 'آلانین', symbol: 'Ala' },
  GCA: { name: 'آلانین', symbol: 'Ala' },
  GCG: { name: 'آلانین', symbol: 'Ala' },

  GAU: { name: 'آسپارتیک اسید', symbol: 'Asp' },
  GAC: { name: 'آسپارتیک اسید', symbol: 'Asp' },
  GAA: { name: 'گلوتامیک اسید', symbol: 'Glu' },
  GAG: { name: 'گلوتامیک اسید', symbol: 'Glu' },

  GGU: { name: 'گلیسین', symbol: 'Gly' },
  GGC: { name: 'گلیسین', symbol: 'Gly' },
  GGA: { name: 'گلیسین', symbol: 'Gly' },
  GGG: { name: 'گلیسین', symbol: 'Gly' },
}

export const STOP_CODONS = ['UAA', 'UAG', 'UGA']

export function translateMRNA(mrna: string): TranslationItem[] {
  const sequence = mrna.toUpperCase().replace(/\s/g, '')
  const startIndex = sequence.indexOf('AUG')

  if (startIndex === -1) return []

  const result: TranslationItem[] = []

  for (let i = startIndex; i + 3 <= sequence.length; i += 3) {
    const codon = sequence.slice(i, i + 3)
    const aminoAcid = GENETIC_CODE[codon]

    if (STOP_CODONS.includes(codon)) {
      result.push({
        codon,
        aminoAcid: 'پایان ترجمه',
        symbol: 'STOP',
        isStart: false,
        isStop: true,
      })
      break
    }

    if (!aminoAcid) break

    result.push({
      codon,
      aminoAcid: aminoAcid.name,
      symbol: aminoAcid.symbol,
      isStart: codon === 'AUG',
      isStop: false,
    })
  }

  return result
}
