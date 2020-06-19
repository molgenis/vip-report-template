export const getNucClasses = function (nuc: string): object {
    const classes: object = {nuc: true}
    // @ts-ignore
    classes['nuc-' + nuc.toLocaleLowerCase()] = true
    return classes
}