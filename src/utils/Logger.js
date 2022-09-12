const print = (message, prefix, logfnc, color = '\x1b[37m') => {
    const date = new Date().toLocaleString();
    const pref = `[${date}]${color}[${prefix}] `;

    message
        .toString()
        .split('\n')
        .forEach((element) => {
            logfnc(`${pref + element}\x1b[37m`);
        });
};

module.exports = {
    info: (message, prefix = 'INFO!') => {
        print(message, prefix, console.log);
    },
    warn: (message, prefix = 'WARN!') => {
        print(message, prefix, console.warn);
    },
    error: (message, error, prefix = 'ERROR', color = '\x1b[31m') => {
        print(message, prefix, console.error, color);
        if (error !== undefined)
            print(error.stack, prefix, console.error, color);
    },
    fatal: (message, error, code, prefix = 'FATAL') => {
        print(message, prefix, console.error);
        if (error !== undefined) print(error.stack, prefix, console.error);
        process.exit(code !== undefined ? code : -1);
    },
};
