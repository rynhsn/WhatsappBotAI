const axios = require('axios');
const { rmKey } = require('../config');

const EditPhotoHandler = async (text, msg) => {
    const cmd = text.split('/edit');
    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik */edit warna*');
    }
    msg.reply(cmd[1].trim());
    if (msg.hasMedia) {
        if (msg.type != 'image') {
            return msg.reply('hanya bisa edit dengan format image.');
        }

        msg.reply('sedang diproses, tunggu bentar ya.');

        const media = await msg.downloadMedia();

        if (media) {
            const color = cmd[1].trim();
            const newPhoto = await EditPhotoRequest(media.data, color)

            if (!newPhoto.success) {
                return msg.reply('Terjadi kesalahan, Adds a solid color background. Can be a hex color code (e.g. 81d4fa, fff) or a color name (e.g. green). For semi-transparency, 4-/8-digit hex codes are also supported (e.g. 81d4fa77).');
            }

            const chat = await msg.getChat();
            media.data = newPhoto.base64;
            chat.sendMessage(media, { caption: 'ini hasilnya' })
        }
    }
}

const EditPhotoRequest = async (base64, bg_color) => {

    const result = {
        success: false,
        base64: null,
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: {
            image_file_b64: base64,
            bg_color: bg_color
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-Api-Key": rmKey,
        },
    })
        .then((response) => {
            if (response.status == 200) {
                result.success = true;
                result.base64 = response.data.data.result_b64
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
    EditPhotoHandler
}