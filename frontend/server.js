const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve JSON files and other specific routes
app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data.json'));
});

// Fallback for single-page apps (serve index.html for other routes)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('*', (req, res, next) => {
  const ext = path.extname(req.url);
  if (!ext) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Frontend is running at http://localhost:${PORT}`);
});
