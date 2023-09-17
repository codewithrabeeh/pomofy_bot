const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_API_KEY,
    process.env.SUPABASE_PROJECT_ID
);

module.exports = async function deleteLastSessionData(ctx) {
    const telegramUserId = ctx.from.id
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
}