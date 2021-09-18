/*
 * Executes each function which returns a Promises in the array sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * await serial(urls.map(url => () => $.ajax(url)))
 */
export function serial(funcs: Function[]) {
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]));
}
