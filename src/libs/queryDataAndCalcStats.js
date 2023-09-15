const messageFormator = require('./messageFormatter')
const checkStreak = require('./checkStreak')
const QuoteGen = require('./quotesGenerator/quoteGenerator')


const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_API_KEY,
    process.env.SUPABASE_PROJECT_ID
);

module.exports = async function queryDataAndCalcStats(telegramUserId, startsIn) {

    const { data: queryData, error: queryError } = await supabase
        .from('room_messages')
        .select('*')
        .eq('telegram_id', telegramUserId)

        
    if (queryError?.message) {
        throw new Error('Something went wrong')
    }

    if (queryData.length === 0) {
        throw new Error('No Message Data Found')
    }

    const streak = checkStreak(queryData)

    const lastIndexOfQueryData = queryData.length-1

    const message = queryData[lastIndexOfQueryData] 

    const {room_code, duration, plant_name} = message

    const durationToNumber = Number(duration)
    const quote = QuoteGen()

    let totalDuration = 0;

    for (const each of queryData) {
        totalDuration += each.duration
    }


    if (totalDuration > 0) {
        totalDuration = totalDuration - durationToNumber
    }

    const totalTree = Math.floor(totalDuration / 30)

    const formattedMessage = messageFormator(quote, room_code, plant_name, duration, totalTree, streak, startsIn)

    return formattedMessage;
}