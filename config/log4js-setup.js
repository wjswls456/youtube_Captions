const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

const logConfigPath = path.join(__dirname, 'log4js-config.json');
const logConfig = JSON.parse(fs.readFileSync(logConfigPath, 'utf8'));

log4js.configure(logConfig);

const logger = log4js.getLogger('cheese');

module.exports = logger;
