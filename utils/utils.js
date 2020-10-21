const { SMS_ID, SMS_TOKEN, SMS_FROM_NUM, DEV_NUM_1, DEV_NUM_2 } = process.env;
const client = require('twilio')(SMS_ID, SMS_TOKEN);

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

State (TX):
    ‣ Biden: ${odds.state.Biden}%
    ‣ Trump: ${odds.state.Trump}%

  `;

/**
 * Sends updates via Twilio
 *
 * @param {Object} odds Updated election forecast
 */
const sendSMSUpdate = async (odds) => {
  console.log('Sending sms update');
  const body = getSMSBody(odds);

  // Can't bundle - Twilio gets mad. "Too many requests" >:(
  await client.messages.create({
    body,
    from: SMS_FROM_NUM,
    to: DEV_NUM_1,
  });

  await client.messages.create({
    body,
    from: SMS_FROM_NUM,
    to: DEV_NUM_2,
  });
};

module.exports = { sendSMSUpdate, calculateOdds };
