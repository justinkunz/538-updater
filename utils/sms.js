const { SMS_ID, SMS_TOKEN, SMS_FROM_NUM, DEV_NUM_1, DEV_NUM_2 } = process.env;
const client = require("twilio")(SMS_ID, SMS_TOKEN);

/**
 * Sends updates via Twilio
 */
const sendUpdate = async (odds) => {
  console.log("Sending sms update");
  const body = `
FiveThirtyEight's 2020 Election odds have updated

🇺🇸 National 🇺🇸:
    ‣ Biden: ${odds.national.Biden}%
    ‣ Trump: ${odds.national.Trump}%

State (TX):
    ‣ Biden: ${odds.state.Biden}%
    ‣ Trump: ${odds.state.Trump}%

  `;

  // Can't bundle - Twilio gets mad. "Too many requests"
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

module.exports = { sendUpdate };
