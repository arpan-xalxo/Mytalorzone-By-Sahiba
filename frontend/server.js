const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173;

app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data.json'));
});



app.get('*', (req, res, next) => {
  const ext = path.extname(req.url);
  if (!ext) {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Frontend is running at http://localhost:${PORT}`);
});

module.exports = app;