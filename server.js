const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
  })
  .then(() => console.log('Connected to DB'));

const app = require('./app');

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));
