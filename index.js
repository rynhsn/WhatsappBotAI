const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./feature/edit_foto');
const { ChatAIHandler } = require('./feature/chat_ai');
const { ImageAIHandler } = require('./feature/image_ai');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {

    const text = msg.body.toLowerCase() || '';

    //check status
    if (text === '!ping') {
        msg.reply('pong');
    }

    // ganti bg
    if (text.includes("/edit")) {
        await EditPhotoHandler(text, msg);
    }
    // pertanyaan
    if (text.includes("/us")) {
        await ChatAIHandler(text, msg);
    }
    // buat gambar
    if (text.includes("/buat")) {
        await ImageAIHandler(text, msg);
    }

});

client.initialize();



