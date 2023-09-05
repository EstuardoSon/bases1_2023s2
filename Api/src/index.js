const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

const router = require('./router/router');

//middleware
app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

app.use('/', router);

const port = 5000;

app.listen(port, () => {
  console.log(`Information: Server running on http://localhost:${port}`);
});