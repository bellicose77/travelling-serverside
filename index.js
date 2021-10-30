const express = require('express');
const app = express();
const port = 5000;
app.get('/', (req, res) => {
    res.send("This is home page");
});
app.listen(port, () => {
    console.log("Running in the port", port);
})