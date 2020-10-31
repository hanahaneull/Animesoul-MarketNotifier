const config = require('./config.json');
const ws = require('socket.io-client');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(config.webhook);

const socket = ws('https://animesoul.com', {
	path: '/socket.io',
	transports: ['websocket'],
});

console.log('Connecting to Animesoul weboscket...');

socket.on('connect', () => {
	console.log('Connected to Animesoul websocket...');
	setInterval(() => {
		socket.emit(2);
	}, 20000);
	console.log('Sending you to market tab...');
	socket.emit('location', 'market');
});

socket.on('disconnect', (reason) => {
	console.log('Disconnected from Animesoul. Reason:', reason);
	console.log('Reconnecting...');
});

socket.on('marketpush', (data) => {
	console.log('New card pushed...');
	const itemname = data.item.item_name;
	const tier = data.item.data.tier;
	const version = data.item.data.version;
	const price = data.item.price;
	const cardinfourl = `https://animesoul.com/cards/info/${data.item.data.cardid}`;
	const event = data.item.data.event ? 'Yes' : 'No';
	const tradehistory = data.item.data.trade_history.length;
	const imageurl = `https://animesoul.com/api/cardr/${data.item.data._id}?size=100`;

	const message = new MessageBuilder()
		.setTitle(itemname)
		.setAuthor('New cards!')
		.setURL(cardinfourl)
		.setColor('#008000')
		.setDescription(
			`Seller: \`\`${data.item.username}\`\` <@${data.item.discordid}>`
		)
		.addField('Tier', tier, true)
		.addField('Version', `${version}`, true)
		.addField('Price', `富${price}`, true)
		.addField('Event card', event)
		.addField('Trade count', tradehistory, true)
		.setImage(imageurl);

	hook.send(message);
});
