const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '5614208854:AAFzhgD-hrXWU9SiqCH-WafZ_ffAUWSkwhg';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, `Я загадал цифру от 0 до 9, угадай её!`);
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
	console.log(chats[chatId]);
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Информация о пользователе' },
		{ command: '/game', description: 'Игра угудай цифру' },
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;
		if (text === '/start') {
			return bot.sendMessage(chatId, `Добро пожаловать в ЧАТ`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`)
	})
	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again') {
			return startGame(chatId)
		}
		console.log(data, chats[chatId]);
		if (+data === chats[chatId]) {
			return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
		} else {
			return await bot.sendMessage(chatId, `К сожалению ты не угадал, я загадал цифру ${chats[chatId]}`, againOptions)
		}
	})
};
start();