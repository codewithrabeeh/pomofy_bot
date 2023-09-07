module.exports = function messageFormator(quote, roomCode, plant, duration, totalTree, streak) {
    const message = `Trees: ${totalTree} 🌳   |   Streak: ${streak} 🔥 \n\n\`${quote}\`
\n🏠 *Room Code*: ${roomCode}\n\n🌲 *Plant*: ${plant}
\n⏳ *Duration*: ${duration} Minutes
\nLink 🔗:\nhttps://www.forestapp.cc/join-room?token=${roomCode}`
    
return message;
}