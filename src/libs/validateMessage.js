let formatArr = [
    'Time', 'to', 'put', 'down', 'your', 'phone', 'and', 'get', 'back', 'work!', 'Enter', 'my', 'room', 'code:', 'plant', 'a', 'with', 'me!', 'You', 'can', 'also', 'tap', 'on', 'this', 'link', 'join', 'me:']

module.exports = function validateMessage(message) {
    const splitMsgToArr = message?.split(' ') ?? null
    if (splitMsgToArr) {
        const validateMsg = formatArr.every(word => splitMsgToArr.includes(word))
        return validateMsg
    }
    return false
}