const { Telegraf, Markup } = require('telegraf');
const schedule = require('node-schedule');

const bot = new Telegraf(process.env.BOT_TOKEN);


module.exports = async function scheduleNotification(telegramUserId, time) {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 60 * 1000 * time);

    // Schedule a notification for each user at their specified time
    schedule.scheduleJob(futureTime, () => {
        bot.telegram.sendMessage(telegramUserId, `${time} Minutes is over. Let\'s Start Planting 🌱`);
    });
}