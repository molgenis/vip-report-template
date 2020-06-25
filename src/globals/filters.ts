const numberFormatWithGrouping = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 1
})

const numberFormatWithoutGrouping = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: false,
    maximumFractionDigits: 1
})

export const formatNumber = function (x: number, grouping: boolean = false): string {
    console.log(x)
    const numberFormat = grouping ? numberFormatWithGrouping : numberFormatWithoutGrouping
    return numberFormat.format(x)
}

export const append = function (thisString: string, thatString: string): string {
    return `${thatString}${thisString}`
}