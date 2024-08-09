export function withoutNulls(children: Array<any>) {
    return children.filter((item) => item != null)
}