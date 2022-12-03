const { Wit, log } = require('node-wit');
const express = require('express');
const { Telegraf } = require('telegraf');
const NodeGeocoder = require('node-geocoder');

//Config .env
require('dotenv').config()

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN)

// Configuración de telegraf
//Conecta al bot con la url que indiquemos
app.use(bot.webhookCallback('/url-telegram'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/url-telegram`)

//El webhook de arriba necesita que se haga una petición post, pero esta petición no sirve para nada más, el res.send no va a ningun sitio.
app.post('/url/telegram', (req, res) => {
    res.send('Pasa pasa, no tengas miedo🤡');
})


//COMANDOS
//Al escribir /test en telegram el bot me contestará con ¿Sabe una cosa?
bot.command('test', async (ctx) => {
    console.log(ctx.message);

    ctx.reply('¿Sabe una cosa?' + ' ' + ctx.message.from.first_name);

    /*   bot.telegram.sendPhoto(ctx.chat.id, "https://cdn.pixabay.com/photo/2021/12/26/19/27/nature-6895756_640.jpg") */
})

bot.command('tiempo', async (ctx) => {
    const texto = ctx.message.text;

    const toString = texto.toString()
    let ciudad = toString.substring(7).trim();

    try {
        const tiempo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`);

        const { main: { temp, temp_min, temp_max, humidity } } = await tiempo.json();

        ctx.reply(` El tiempo en ${ciudad.toUpperCase()} es: 
        🌡Temperatura: ${temp}º
        🥶Minima: ${temp_min}º
        🥵Máxima: ${temp_max}º
        💧Humedad: ${humidity}%`)

    } catch (error) {
        console.log(error)
    }
})

bot.command('donde', async (ctx) => {
    const texto = ctx.message.text;
    const toString = texto.toString()
    let calle = toString.substring(7).trim();

    const options = {
        provider: "google",
        apiKey: process.env.GOOGLE_API_KEY,
    };

    const geocoder = NodeGeocoder(options);
    try {
        const [{ latitude, longitude }] = await geocoder.geocode(calle)
        ctx.replyWithLocation(latitude, longitude)
    } catch (error) {
        console.log(error)
    }
})

bot.command('sticker', async (ctx) => {
    console.log(ctx)
    const texto = ctx.message.text;

})

//Si le envias un mensaje contexta con lo siguiente el texto que le pongas.
/* bot.on('text', async (ctx) => {
    const client = new Wit({
        accessToken: process.env.WIT_TOKEN,
        logger: new log.Logger(logger.DEBUG)
    });

    const response = await client.message(ctx.message.text)

    if (response.intents.length === 0 || response.intents[0].confidence < 0.8) {

        return ctx.reply('Que fucking dices');
    }

    ctx.reply(`La categoria es: ${response.intents[0].name}`)
}) */

bot.on('text', async (ctx) => {

    const frasecitas = new Array('Si tienes novia debes serle fiel, y en tu caso, dar las gracias.', 'No eres un completo inútil, al menos sirves de mal ejemplo', 'Sabias que el matrimonio es la principal causa del divorcio?', 'Hay muchas cosas en la vida más importantes que el dinero. ¡Pero cuestan tanto!', ' El verdadero amor sólo se presenta una vez en la vida… y luego ya no hay quien se lo quite de encima', 'Fuera del perro, un libro es probablemente el mejor amigo del hombre, y dentro del perro probablemente está demasiado oscuro para leer', '¿Usted piensa antes de hablar o habla tras pensar?', 'Hay que fabricar máquinas que nos permitan seguir fabricando máquinas, porque lo que no va a hacer nunca la máquina es fabricar máquinas', 'Sabes contar? Pues no cuentes conmigo')
    cont = Math.floor(Math.random() * frasecitas.length)
    ctx.reply(frasecitas[cont])


})

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor funcionando')
})