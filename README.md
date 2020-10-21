# 538 Updater

Simple Heroku Worker to send SMS updates when 538's 2020 election predictions change

## Set Up Steps

1. [Create a Twilio Account](https://www.twilio.com/try-twilio)
2. Set the [config settings](./config.json) to specify the state poll to watch, how often to check & the threshold results must pass before an alert is issued.
3. Deploy to heroku.
4. Set the following environment variables:

```
SMS_FROM_NUM=(Twilio from number)
SMS_ID=(Twilio SMS ID)
SMS_TOKEN=(Twilio SMS Token)
PHONE_NUMBERS=(Phone Numbers, seperated by ";" - example: "3235554433;2145559988;4698887777")
```
