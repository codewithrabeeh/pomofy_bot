const datas = require('./datas')

const QuoteGen = () => {
    const length = datas.length;
    const randomIndex = Math.floor(Math.random() * length) 
    return datas[randomIndex]
}

module.exports = QuoteGen; 