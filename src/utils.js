require('./Array.prototype.equals')

const isInside = (haystack, needle, index) => {
    index = index || 0
    if (needle instanceof Array) {
        return haystack.slice(index).find(a => needle.equals(a)) !== undefined
    } else {
        return haystack.includes(needle, index)
    }
}

module.exports = {
    isInside,
}