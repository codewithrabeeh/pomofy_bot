const dayjs = require('dayjs')
module.exports = function checkStreak(queryData) {
    const sortedData = []
    queryData.map((item) => {
        const itemDate = dayjs(item.created_at).format('YYYY-MM-DD')
        if(!sortedData.includes(itemDate)){
            sortedData.push(itemDate)
        }  
    }) 
    // NOTE: Above commented are set to sort. Now Count the streak.

    const sortedDate = sortedData.sort().reverse()
    
    let countStreakDays = 0;
    let stopCounting = false
    sortedDate.forEach((item, index) => {
        if (!stopCounting) {
            let currentDay = item?.split('')[8] + item?.split('')[9]
            let nextDay = sortedDate[index + 1]?.split('')[8] + sortedDate[index + 1]?.split('')[9]

            if (nextDay) {
                const diff = currentDay - nextDay;

                if (diff === 1) {
                    countStreakDays += 1
                } else {
                    stopCounting = true
                }
            }
        }
    })

    return countStreakDays
}