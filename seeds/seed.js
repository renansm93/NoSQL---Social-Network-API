const connection = require('../config/connection');
const wUser = require('../models/User');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  const User = [
    { username: 'User1', email: 'user1@email.com' },
    { username: 'User2', email: 'user2@email.com' },
    { username: 'User3', email: 'user3@email.com' },
  ];

  wUser.insertMany(User)
  .then((result) => {
    console.log('Users inserted successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting Users:', error);
  });

  const result = await wUser.collection.insertMany(User);
  console.log(result);
  process.exit(0);
});
