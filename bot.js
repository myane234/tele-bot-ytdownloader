const { Telegraf } = require('telegraf');
const { exec } = require('child_process');
const fs = require('fs');

const bot = new Telegraf('------'); // Ganti dengan API Token telegram

bot.start((ctx) => {
    ctx.reply('Selamat datang di myanebot! Kirimkan link YouTube untuk mendownload.');
});

bot.on('text', (ctx) => {
    const url = ctx.message.text;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        ctx.reply('waitt lagi download...');

        const outputFileName = 'video.mp4.webm';
        const command = `yt-dlp -o "${outputFileName}" ${url}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Gagal mendownload video: ${error.message}`);
                ctx.reply('Gagal mendownload video. Silakan coba lagi.');
                return;
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
                ctx.reply('Terjadi kesalahan saat mendownload video. Silakan coba lagi.');
                return;
            }

            if (fs.existsSync(outputFileName)) {
                ctx.replyWithVideo({ source: outputFileName }).catch((err) => {
                    console.error(`Gagal mengirim video: ${err.message}`);
                });
            } else {
                ctx.reply('Video tidak ditemukan. Silakan coba lagi.');
            }
        });
    } else {
        ctx.reply('Silakan kirimkan link YouTube yang valid.');
    }
});

bot.launch().then(() => {
    console.log('Bot berjalan...');
}).catch(err => {
    console.error('Gagal menjalankan bot:', err);
});
