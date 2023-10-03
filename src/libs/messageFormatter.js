module.exports = function messageFormator(quote, roomCode, plant, duration, totalTree, streak, startsIn, session) {
    const message = `*Session ${session} ✨*
\nToday: ${totalTree} 🌳 with 🧑‍🤝‍🧑   |   Streak: ${streak} 🔥 \n\n\`${quote}\`
\n🏠 *Room Code*: ${roomCode}\n\n🌲 *Plant*: ${plant}
\n⏳ *Duration*: ${duration} Minutes
\nLink 🔗:\nhttps://www.forestapp.cc/join-room?token=${roomCode}
\nStarts in *${startsIn} Minutes* ⏰`
    
return message;
}