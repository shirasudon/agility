const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/static", express.static(path.join(__dirname, '../../dist')));

app.get('/hello', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});
