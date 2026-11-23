// ========== تایپ‌ها ==========
// اینا فقط برای TypeScript هستن که بدونیم چه نوع داده‌ای داریم
export type RNANucleotide = 'A' | 'U' | 'C' | 'G'

// ========== توابع ==========

/**
 * تبدیل DNA به mRNA
 * قانون: A→U , T→A , C→G , G→C
 * مثال: "ATGC" → "UACG"
 */
export function transcribeDNA(dna: string): string {
  // جدول تبدیل: هر باز DNA به چی توی mRNA تبدیل میشه
  const complement: Record<string, string> = {
    'A': 'U',
    'T': 'A',
    'C': 'G',
    'G': 'C'
  }
  
  return dna
    .toUpperCase()           // همه حروف رو بزرگ کن
    .split('')               // رشته رو به آرایه تبدیل کن: "ATG" → ['A','T','G']
    .map(base => complement[base] || '?')  // هر باز رو به معادلش تبدیل کن
    .join('')                // آرایه رو دوباره به رشته تبدیل کن
}

/**
 * اعتبارسنجی رشته DNA
 * فقط A,T,C,G مجازه، حداکثر ۳۰ تا
 */
export function validateDNA(sequence: string): { isValid: boolean; errorMessage: string } {
  if (sequence.length === 0) {
    return { isValid: false, errorMessage: 'لطفاً یک توالی DNA وارد کنید' }
  }
  
  if (sequence.length > 30) {
    return { isValid: false, errorMessage: 'حداکثر ۳۰ نوکلئوتید مجاز است' }
  }
  
  if (!/^[ATCG]*$/.test(sequence.toUpperCase())) {
    return { isValid: false, errorMessage: 'فقط حروف A, T, C, G مجاز هستند' }
  }
  
  return { isValid: true, errorMessage: '' }
}

/**
 * محاسبه درصد هر باز در mRNA
 * مثال: "AUGC" → { A:25%, U:25%, G:25%, C:25% }
 */
export function calculateNucleotidePercentages(mrna: string): Record<RNANucleotide, number> {
  const counts: Record<RNANucleotide, number> = { A: 0, U: 0, C: 0, G: 0 }
  const total = mrna.length || 1  // جلوگیری از تقسیم بر صفر
  
  for (const base of mrna) {
    if (base in counts) {
      counts[base as RNANucleotide]++
    }
  }
  
  return {
    A: Math.round((counts.A / total) * 100),
    U: Math.round((counts.U / total) * 100),
    C: Math.round((counts.C / total) * 100),
    G: Math.round((counts.G / total) * 100),
  }
}

/**
 * شکستن mRNA به کدون‌ها (بسته‌های ۳ تایی)
 * مثال: "AUGCCG" → ["AUG", "CCG"]
 */
export function splitIntoCodons(mrna: string): string[] {
  const codons: string[] = []
  for (let i = 0; i < mrna.length; i += 3) {
    codons.push(mrna.substring(i, i + 3))
  }
  return codons
}