const axios = require('axios');
const { keyOpenAi } = require('../config');
const { MessageMedia } = require('whatsapp-web.js');

const ImageAIHandler = async (text, msg) => {

    const cmd = text.split('/buat');

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik */buat parameter*');
    }

    const prompt = cmd[1].trim();
    const response = await ImageRequest(prompt);

    if (!response.success) {
        return msg.reply(response.message);
    }

    const media = await MessageMedia.fromUrl(response.data);
    const chat = await msg.getChat();
    chat.sendMessage(media, { caption: 'ini hasilnya' });
}


const ImageRequest = async (text) => {

    const result = {
        success: false,
        data: "Gagal memproses gambar",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        data: {
            prompt: text,
            n: 1,
            size: "512x512"
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${keyOpenAi}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {
                result.success = true;
                result.data = response.data.data[0].url;
                // console.log(result);
            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ImageAIHandler
}