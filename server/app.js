const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');

app.use(logger('dev'));
app.use(express.json());
app.use('/scripts', express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/favicons', express.static(path.join(__dirname, '..', 'public/favicons')));

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500).send({ error: err.message })
})

module.exports = app;
