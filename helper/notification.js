import axios from 'axios'

export const send_notification_telegram = async (message) => {
    const supergroup_id = "-1002040302052"
    const hokages_supergroup_id = "-1002045069509"

    await axios.post("https://api.telegram.org/bot6733472591:AAEIhjs99ZShmHISq-nuy676xSiXsC72cTE/sendMessage", {
        chat_id: hokages_supergroup_id,
        text: message,
        message_thread_id: '796',
    })
    .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}