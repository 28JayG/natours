const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const Tour = require('../../model/tours.model');

const DB = process.env.DB_CONNECT_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
).replace('<USERNAME>', process.env.DB_USERNAME);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
