import {getNucClasses} from '@/globals/utils'

test('get nucleotide classes for nucleotide A', () => {
    expect(getNucClasses('A')).toEqual({nuc: true, 'nuc-a': true})
})

test('get nucleotide classes for nucleotide C', () => {
    expect(getNucClasses('C')).toEqual({nuc: true, 'nuc-c': true})
})

test('get nucleotide classes for nucleotide T', () => {
    expect(getNucClasses('T')).toEqual({nuc: true, 'nuc-t': true})
})

test('get nucleotide classes for nucleotide G', () => {
    expect(getNucClasses('G')).toEqual({nuc: true, 'nuc-g': true})
})