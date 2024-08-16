export function isNotBlankOrEmptyString(str: string): boolean {
    if (!str || str.length === 0)
        return false;
    return str.trim() !== '';
}