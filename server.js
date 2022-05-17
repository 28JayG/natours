const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Unhandled Exception! Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DB_CONNECT_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
).replace('<USERNAME>', process.env.DB_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'));

const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`app running on port: ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting down...');
  console.log(err.name, err.message);

  //let server finsih all on going task and then crash the app
  server.close(() => {
    process.exit(1);
  });
});
