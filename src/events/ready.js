const Logger = require('../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        Logger.info(`${client.user.tag} has logged in !`);
    },
};
