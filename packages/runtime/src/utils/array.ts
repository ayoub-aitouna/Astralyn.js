export function withoutNulls(children: Array<any>) {
    return children.filter((item) => item != null)
}


export function ArrayDiff(oldArray: any[], newArray: any[]) {
    // TODO: get index of added/removed element 
    return {
        added: newArray.filter(item => !oldArray.includes(item)),
        removed: oldArray.filter(item => !newArray.includes(item)),
    }
}