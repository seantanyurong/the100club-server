import axios from 'axios'

export const send_notification_telegram = async (message) => {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_GROUP_ID,
        text: message,
        message_thread_id: process.env.MESSAGE_THREAD_ID,
    })
    .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}