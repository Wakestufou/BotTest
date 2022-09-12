const Logger = require('../utils/Logger');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        Logger.info(message, 'MESSAGE');
    },
};
