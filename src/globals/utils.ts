export const getNucClasses = function (nuc: string): object {
    let classes: object = {nuc: true}
    // @ts-ignore
    classes['nuc-' + nuc.toLocaleLowerCase()] = true
    return classes
}