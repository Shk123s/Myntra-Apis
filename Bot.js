const { Bot, InputFile } = require('grammy');
const { InlineKeyboard } = require("grammy");
require('dotenv').config(); 
const token = process.env.TOKEN;
const bot = new Bot(token);

const replyWithIntro = (ctx) => {
  const chatId = ctx.update.message.chat.id;
  const message = ctx.update.message.text;
  const introductionMessage = `Hello ${ctx.update.message.from.first_name}! I'm a Telegram bot.
          I'm powered by shaqeeb, the next-generation serverless computing platform`;
  if (message === "/start") {
    ctx.reply(introductionMessage, {
      parse_mode: "HTML",
    });
  }
  if (message === "Hii") {
    const inlineKeyboard = new InlineKeyboard()
      .text("1" ).url("first","www.youtube.com").row()
      .text("2" ).url("second","www.youtube.com").row()
      .text("3" ).url("third","www.youtube.com").row()
      .text("4" ).url("fourth","www.youtube.com").row()

    ctx.reply('Hii! how are you ?', { reply_markup: inlineKeyboard });
  }
  if (message === 'Good' || message === 'Mast' || message === 'Nice') {
    ctx.reply('mast ekdam...', chatId);
  }
  if (message === 'Aur kya bolte bacchi') {
    ctx.reply('ahh meri jaaaaaaan', chatId);
  }
  if (message === 'Bye') {
    ctx.replyWithPhoto(new InputFile("./bye.png"), chatId);
  }
};

bot.on("message", replyWithIntro);
bot.start();
