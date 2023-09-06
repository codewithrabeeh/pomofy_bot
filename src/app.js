require('dotenv').config();

const { Telegraf } = require('telegraf');
const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const app = express()

const plantNameGen = require('./libs/plantNameGenerator')
const messageFormator = require('./libs/messageFormatter')
const QuoteGen = require('./libs/quotesGenerator/quoteGenerator')


app.use(express.static('static'))
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_API_KEY,
    process.env.SUPABASE_PROJECT_ID
);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
    const telegramUserId = ctx.from.id
    const telegramUserName = ctx.from.username
    const telegramName = ctx.from.first_name

    let { data, error } = await supabase.from('user').select('*').eq('telegram_id', telegramUserId);

    if (data.length === 0) {
        const userData = { telegram_id: telegramUserId, username: telegramUserName, name: telegramName }
        let { data, error } = await supabase.from('user').insert([userData])
        if (error?.message) {
            return ctx.reply('Something went wrong. Please try again.')
        }
    }
    ctx.reply('*Send Your Study Room Message Like Below:*\n\nTime to put down your phone and get back to work! Enter my room code: (code) to plant a X-minute (tree name) Tree with me! You can also tap on this link to join me: (forest link)', { parse_mode: 'Markdown' })

})

bot.command('deletelastsession', async (ctx) => {
    const telegramUserId = ctx.from.id
    // Assuming you have a timestamp column named 'created_at' in your table

    // Get the timestamp of the last inserted record
    const { data: lastInsertion, error: lastInsertionError } = await supabase
        .from('room_messages')
        .select('created_at')
        .eq('telegram_id', telegramUserId)
        .order('created_at', { ascending: false })
        .limit(1);
   
    if (lastInsertionError) {
        ctx.reply('Error deleting last session data.')
        console.error('Error fetching last inserted data:', lastInsertionError.message);
    } else if (lastInsertion && lastInsertion.length > 0) {
        const lastInsertedTimestamp = lastInsertion[0].created_at;

        // Delete the last inserted record based on the timestamp
        const { data: deletionResult, error: deletionError } = await supabase
            .from('room_messages')
            .delete()
            .eq('telegram_id', telegramUserId)
            .eq('created_at', lastInsertedTimestamp);

        if (deletionError) {
            ctx.reply('Error deleting last session data.')
            console.error('Error deleting last inserted data:', deletionError.message);
        } else {
            ctx.reply('Last session data deleted successfully.')
        }
    } else {
        ctx.reply('No data found to delete.')
    }
})


bot.on('text', async (ctx) => {
    const telegramUserId = ctx.from.id
    const receivedText = ctx.message?.text?.split(' ') ?? null;
    const Quote = QuoteGen()
    let validateMessage;

    if (receivedText) { // TODO: Create a function in libs and compare the message end-to-end and return boolean
        const stringsToCheck = ['back', 'work!', 'Enter', 'plant', 'down', 'room']
        validateMessage = stringsToCheck.every(string => receivedText.includes(string))
    }

    if (validateMessage) {
        const roomCode = receivedText[15]
        let plant = plantNameGen(receivedText)
        const duration = receivedText[19]?.replace('-', ' ')?.split(' ')[0]
        const durationToNumber = Number(duration)
        const quote = QuoteGen()

        const messageData = { telegram_id: telegramUserId, room_code: roomCode, plant_name: plant, duration: durationToNumber }
        const { data: insertData, error: insertError } = await supabase.from('room_messages').insert([messageData])

        if (insertError?.code && insertError?.code !== '23505') {
            return ctx.reply('Something went wrong! Please forward the study room message again')
        }

        const { data: queryData, error: queryError } = await supabase
            .from('room_messages')
            .select('*')
            .eq('telegram_id', telegramUserId)

        if (queryError?.message) {
            return ctx.reply('Something went wrong!')
        }

        let totalDuration = 0;

        for (const each of queryData) {
            totalDuration += each.duration
        }

        if(totalDuration > 0){
            totalDuration = totalDuration - durationToNumber
        }

        const totalTree = Math.floor(totalDuration / 30)

        const message = messageFormator(quote, roomCode, plant, duration, totalTree)

        ctx.reply(message, { parse_mode: 'Markdown' })
    }
})

bot.launch()