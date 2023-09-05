require('dotenv').config();

const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const app = express()

app.use(express.static('static'))
app.use(express.json());
const { Telegraf } = require('telegraf');

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
        const newData = { telegram_id: telegramUserId, streak: 1, username: telegramUserName, name: telegramName }
        let { data, error } = await supabase.from('user').insert([newData])
    }
    ctx.reply('*Send Your Study Room Message Like Below:*\n\nTime to put down your phone and get back to work! Enter my room code: (code) to plant a X-minute (tree name) Tree with me! You can also tap on this link to join me: (forest link)', { parse_mode: 'Markdown' })
})

bot.on('text', async (ctx) => {
    const QuoteGen = require('./libs/quotesGenerator/quoteGenerator')
    const receivedText = ctx.message?.text?.split(' ') ?? null;
    const Quote = QuoteGen()
    let validateMessage;
    let streak;

    if (receivedText) {
        const stringsToCheck = ['back', 'work!', 'Enter', 'plant', 'down', 'room']
        validateMessage = stringsToCheck.every(string => receivedText.includes(string))
    }

    if (validateMessage) {
        const roomCode = receivedText[15]

        /* Code to Get The Full Name of Plant Starts */
        let plantNameArr = []
        for (var i = 20; i <= 28; i++) {
            if (receivedText[i] != 'with') {
                plantNameArr.push(receivedText[i])
            } else {
                break;
            }
        }
        let plant = plantNameArr?.join(' ')      
        /* Code to Get The Full Name of Plant Finish */

        const duration = receivedText[19]?.replace('-', ' ')
        const link = `https://www.forestapp.cc/join-room?token=${roomCode}`

        return ctx.reply(`*Quote of the day:*\n\`${Quote}\`\n\n🏠 *Room Code*: ${roomCode}\n\n🌲 *Plant*: ${plant}\n\n⏳ *Duration*: ${duration}\n\nLink 🔗:\n${link}`, { parse_mode: 'Markdown' })
    }
    ctx.reply('Please give a valid forest\'s plant together create room message. Only support English version!')
})

bot.launch()