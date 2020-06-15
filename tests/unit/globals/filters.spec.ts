import {numberWithCommas} from '@/globals/filters'

test('format number between -10000 and -1000', () => {
    expect(numberWithCommas(-1234)).toEqual('-1,234')
})

test('format number between -1000 and 0', () => {
    expect(numberWithCommas(-999)).toEqual('-999')
})

test('format number between 0 and 1000', () => {
    expect(numberWithCommas(999)).toEqual('999')
})

test('format number between 1000 and 10000', () => {
    expect(numberWithCommas(1234)).toEqual('1,234')
})

test('format number between 1000000 and 10000000', () => {
    expect(numberWithCommas(1234567)).toEqual('1,234,567')
})