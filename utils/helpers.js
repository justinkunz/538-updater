const { SMS_ID, SMS_TOKEN, SMS_FROM_NUM: from, PHONE_NUMBERS } = process.env;

const client = require('twilio')(SMS_ID, SMS_TOKEN);
const logger = require('./logger');
const config = require('../config.json');

/**
 * Determine win odds per canidate
 *
 * @param {Array} simulations 538 Simulations
 */
const calculateOdds = (simulations) =>
  simulations.reduce((acc, { winner }) => {
    if (Object.prototype.hasOwnProperty.call(acc, winner)) {
      acc[winner]++;
    } else {
      acc[winner] = 1;
    }
    return acc;
  }, {});

/**
 * Generate SMS Body for sending updates
 *
 * @param {Object} odds Updated election forecast
 */
const getSMSBody = (odds) => `
FiveThirtyEight's 2020 Election odds have updated

🇺🇸 National 🇺🇸:
    ‣ Biden: ${odds.national.Biden}%
    ‣ Trump: ${odds.national.Trump}%

State (${config.state}):
    ‣ Biden: ${odds.state.Biden}%
    ‣ Trump: ${odds.state.Trump}%

  `;

/**
 * Sends updates via Twilio
 *
 * @param {Object} odds Updated election forecast
 */
const sendSMSUpdate = async (odds) => {
  logger.info('Sending sms update');
  const body = getSMSBody(odds);
  const phoneNumbers = PHONE_NUMBERS.split(';');
  await Promise.all(phoneNumbers.map((to) => client.messages.create({ body, from, to })));

  logger.info('Successfully sent sms update');
};

module.exports = { sendSMSUpdate, calculateOdds };
