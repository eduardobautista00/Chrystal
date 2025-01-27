const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: '95b8201b',
  apiSecret: 'JfftV0Acjh6fUhYr',
});

const from = 'Krystal';
const to = '+639276113969';
const text = 'A text message sent using the Vonage SMS API';

vonage.sms.send({ to, from, text })
  .then((resp) => {
    console.log('Message sent successfully');
    console.log(resp);
  })
  .catch((err) => {
    console.log('There was an error sending the messages.');
    console.error(err);
  });