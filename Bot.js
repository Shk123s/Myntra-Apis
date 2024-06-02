const { Bot, InputFile } = require('grammy');
const { InlineKeyboard } = require("grammy");

require('dotenv').config(); 
const token = process.env.TOKEN;
const bot = new Bot(token);

const replyWithIntro = (ctx) => {
  const chatId = ctx.update.message.chat.id;
  const message = ctx.update.message.text;
  const introductionMessage = `Hello ${ctx.update.message.from.first_name}! I'm a Telegram bot.
          I'm powered by shaqeeb, the next-generation serverless computing platform for Booking your Time slot.
          Please Enter your budget `;
    
  if (message === "/start") {
    ctx.reply(introductionMessage,{
      parse_mode: "HTML",
    });
  }
  const number =  parseInt(ctx.update.message.text, 10);
  if (number == ctx.update.message.text) {
    console.log(ctx.update.message.text)
    const inlineKeyboard = new InlineKeyboard()
    .text("1000"," Booked for 1000 " ).row()
    .text("2000"," Booked for 2000 " ).row()
    .text("5000"," Booked for 5000 " ).row()
    .text("10000"," Booked for 10000 " ).row()
    .text("else "," custom " ).row()

    ctx.reply('Hii ! What budget you what to select ?', { reply_markup: inlineKeyboard });
  }
  if (message === 'Thank you') {
    ctx.reply('Your Most Welcome...Bye', chatId);
  }
  if (message === 'Bye') {
    ctx.replyWithPhoto(new InputFile("./bye.png"), chatId);
  }
};

bot.on("message", replyWithIntro);
bot.on('callback_query', (ctx) => {
  const url = ctx.update.callback_query.data;
  ctx.reply(`Open: ${url}`);
});
bot.start();