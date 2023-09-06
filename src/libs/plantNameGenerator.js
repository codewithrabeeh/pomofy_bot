module.exports = function plantNameGen(arrOfText) {
    let plantNameArr = []
    for (var i = 20; i <= 28; i++) {
        if (arrOfText[i] != 'with') {
            plantNameArr.push(arrOfText[i])
        } else {
            break;
        }
    }
    let plant = plantNameArr?.join(' ')
    return plant;
}