const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("./options")

const telegramToken = "6958435283:AAGiHiT6jhKJYsn4kWPdfcecD3NN3ymIqtg"

const bot = new TelegramApi(telegramToken, {polling: true})

const chats = {}


const startGame = async (chatId) => {
            await bot.sendMessage(chatId, "Я загадал цифру от 0 до 9, угадай число, нуб")
            const randomNumber = Math.floor(Math.random() * 10)
            chats[chatId] = randomNumber;
            await bot.sendMessage(chatId, "Отгадывай давай", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: "/info", description: "Получить информацию о пользотеле"},
        {command: "/game", description: "Игра угадай число"},
    ])
    
    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id;
    
        if(text === '/start'){
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/25d/f5a/25df5a18-cf79-4b3e-a2f1-4862771ebd1c/10.webp")
           return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
        }
        if(text === '/info'){
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    
        }
        if(text === '/game'){
            return startGame(chatId)
        }
       return bot.sendMessage(chatId, "Я тебя не понимаю")
    })

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            console.log(data)
            console.log(chats[chatId])
            return bot.sendMessage(chatId, `К сожалению ты не угадал, я загадал ${chats[chatId]}`, againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}

start()