import { describe, it, expect } from 'vitest'
import { transcribeDNA, validateDNA, splitIntoCodons } from '../../utils/transcription'

describe('transcribeDNA', () => {
  it('should convert ATGC to UACG', () => {
    const result = transcribeDNA('ATGC')
    expect(result).toBe('UACG')
  })

  it('should handle lowercase letters', () => {
    const result = transcribeDNA('atgc')
    expect(result).toBe('UACG')
  })
})

describe('validateDNA', () => {
  it('should return error for empty string', () => {
    const result = validateDNA('')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('لطفاً یک توالی DNA وارد کنید')
  })

  it('should return error for invalid characters', () => {
    const result = validateDNA('ATGZ')
    expect(result.isValid).toBe(false)
  })

  it('should accept valid DNA sequence', () => {
    const result = validateDNA('ATGC')
    expect(result.isValid).toBe(true)
    expect(result.errorMessage).toBe('')
  })
}) // <--- اینجا اصلاح شد: }) 

describe('splitIntoCodons', () => {
  it('should split a valid mRNA sequence into codons', () => {
    const result = splitIntoCodons('AUGCCG')
    expect(result).toEqual(['AUG', 'CCG'])
  })

  it('should handle sequences that are not multiples of 3', () => {
    const result = splitIntoCodons('AUGCC')
    expect(result).toEqual(['AUG', 'CC'])
  })
})