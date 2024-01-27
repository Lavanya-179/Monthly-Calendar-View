export function uuID(length) {
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .slice(0, length);
}
