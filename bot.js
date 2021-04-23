
const { Telegraf } = require('telegraf')
require("dotenv").config()
const bot = new Telegraf(process.env.DATA_TOK);
const axios = require("axios").default;
//const Markup = require('telegraf/markup')
const { Markup } = require('telegraf')
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const userModel = require("./bd")


let test;
let index = 0

bot.command('start', async (ctx) => {
  return await ctx.reply(`Привет ${ctx.from.first_name}!
  выбери кухню какая тебе нравится`, Markup
    .keyboard([
      ['🇺🇸 Americain', '🇫🇷French'], // Row1 with 2 buttons
      ['😂  может просто...'], // Row2 with 2 buttons
    ])
    .oneTime()
    .resize()
  )
})

bot.hears('😂  может просто...', (ctx) => {
  axios.request(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIFAPIKEY}`).then(function (response) {
    console.log(response.data.data.url);
    ctx.replyWithVideo({ url: response.data.data.url })
  }).catch(function (error) {
    console.error(error);
  });
})

bot.hears('🇺🇸 Americain', async (ctx) => {

  let urlForCuisine = `https://api.spoonacular.com/recipes/complexSearch?cuisine=American&${process.env.APIKEY}`
  const response = await fetch(urlForCuisine)
  const data = await response.json();
  //console.log(data);
  test = data
  console.log("TTTTTTTT", test);
  let sult = data.results[0]
  let user = await userModel.create({ idUser: ctx.from.id, idRec: sult.id })
  console.log(user);

  ctx.replyWithPhoto({ url: sult.image },
    {
      caption: `${sult.title}`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Рецептик?', "ok"),
        Markup.button.callback('Нет...Хочу что другое', 'else')
      ])
    }
  )
})

bot.hears('🇫🇷French', async (ctx) => {

  let urlForCuisine = `https://api.spoonacular.com/recipes/complexSearch?cuisine=French&${process.env.APIKEY}`
  const response = await fetch(urlForCuisine)
  const data = await response.json();
  //console.log(data);
  test = data
  console.log("TTTTTTTT", test);
  let sult = data.results[0];
  if (await userModel.findOne({ idUser: ctx.from.id })) {
    let user = await userModel.findOneAndUpdate({ idUser: ctx.from.id }, { idRec: sult.id })
    console.log(user);
  }
  else {
    let user = await userModel.create({ idUser: ctx.from.id, idRec: sult.id })
    console.log(user);
  }


  ctx.replyWithPhoto({ url: sult.image },
    {
      caption: `${sult.title}`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Рецептик?', "ok"),
        Markup.button.callback('Нет...Хочу что другое', 'else')
      ])
    }
  )
})
console.log("___________", test);

bot.action('ok', async (ctx) => {
  let user = await userModel.findOne({ idUser: ctx.from.id })
  console.log(user);
  let urlForCuisine1 = `https://api.spoonacular.com/recipes/${user.idRec}/information?includeNutrition=false&${process.env.APIKEY}`
  const resp = await fetch(urlForCuisine1)
  const dat = await resp.json();
  console.log(dat);
  ctx.replyWithHTML(dat.summary)

})


bot.action("else", async (ctx) => {
  index += 1;
  let newRec = test.results[index];
  console.log(newRec);
  let user = await userModel.findOneAndUpdate({ idUser: ctx.from.id }, { idRec: newRec.id })
  ctx.replyWithPhoto({ url: newRec.image },
    {
      caption: `${newRec.title}`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Рецептик?', "ok"),
        Markup.button.callback('Нет...Хочу что другое', 'else')
      ])
    }
  )
})




// bot.hears('🇷🇺 Russian', ctx => ctx.reply('Free hugs. Call no!'))


// .on('callback_query', (ctx) => {
//   // отвечаем телеграму что получили от него запрос
//   ctx.answerCbQuery();
//   // удаляем сообщение
//   ctx.deleteMessage();
//   // отвечаем на нажатие кнопки
//   ctx.reply('You press ' ctx.callbackQuery.data, menu())
// });
// запускаем бот
bot.launch();
