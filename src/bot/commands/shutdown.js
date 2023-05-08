let timeout = null;

module.exports.runTerminal = async function(BOT, args) {
	if (args.includes('-c'))
		if (timeout === null)
			return BOT.prompt.info('No timeout has been set.');
		else {
			clearTimeout(timeout);
			timeout = null;
			delete BOT.hotreloadDisabledReasons['shutdown-t'];
			return BOT.prompt.info('Timeout cleared! Shutdown aborted.');
		}

	let force = args.includes('-f');

	if (args.includes('-t')) {
		let time = parseInt(args[args.indexOf('-t') + 1]);

		if (isNaN(time))
			return BOT.prompt.warning('The time argument isn\'t an int as expected.');

		if (time * 1000 >= 2147483647)
			return BOT.prompt.warning('Please enter a number of second less than 2147483.');
        
		if (force && time < 10)
			return BOT.prompt.warning('Please enter a timeout higher than 10s for force.');

		if (time < 0)
			return BOT.prompt.warning('Please enter a positive value.');

		timeout = setTimeout(function() {
			if (force)
				process.exit();
			else
				BOT.shutdown(2);
		}, time * 1000);
		BOT.hotreloadDisabledReasons['shutdown-t'] = 'Cannot hot-reload the bot with a shutdown timeout. Please execute shutdown -c';
		return BOT.prompt.info('The bot will shutdown in ' + time + ' seconds' + (force ? ' in force' : '') + '.' + (force ? '\nThis will maybe create a data loss.' : ''));
	}

	if (force)
		return BOT.prompt.info('Cannot shutdown instantly with force (for security measures & data protection). Confirm it by using `shutdown -t 10 -f`. It\'s to prevent any mistyping.');
	BOT.shutdown(2);
};

module.exports.run = async function(BOT, author, args, msg) {
	if (args.includes('-c'))
		if (timeout === null)
			return msg.channel.send('No timeout has been set.');
		else {
			clearTimeout(timeout);
			timeout = null;
			delete BOT.hotreloadDisabledReasons['shutdown-t'];
			return msg.channel.send('Timeout cleared! Shutdown aborted.');
		}

	let force = args.includes('-f');

	if (args.includes('-t')) {
		let time = parseInt(args[args.indexOf('-t') + 1]);

		if (isNaN(time))
			return msg.channel.send('The time argument isn\'t an int as expected.');

		if (time * 1000 >= 2147483647)
			return msg.channel.send('Please enter a number of second **less than 2147483**.');

		if (force && time < 10)
			return msg.channel.send('Please enter a timeout **higher than 10s for force**.');

		if (time < 0)
			return msg.channel.send('Please enter a positive value.');

		timeout = setTimeout(function() {
			if (force)
				process.exit();
			else
				BOT.shutdown(2);
		}, time * 1000);
		BOT.hotreloadDisabledReasons['shutdown-t'] = 'Cannot hot-reload the bot with a shutdown timeout. Please execute shutdown -c';
		return msg.channel.send('The bot will shutdown in ' + time + ' seconds' + (force ? ' in force' : '') + '.' + (force ? '\nThis will maybe create a data loss.' : ''));
	}

	if (force)
		return msg.channel.send('Cannot shutdown instantly with force (for security measures & data protection). Confirm it by using `shutdown -t 10 -f`. It\'s to prevent any mistyping.');
	BOT.shutdown(2);
};

module.exports.about = {
	'command': 'shutdown',
	'description': 'Shutdowns the bot.',
	'examples': ['shutdown', '\nshutdown -t 10 **shutdowns in 10s**', '\nshutdown -f **force, may trigger errors**', '\nshutdown -c **clears timeout**'],
	'discord': true,
	'terminal': true,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': true
};