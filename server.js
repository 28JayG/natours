const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));
