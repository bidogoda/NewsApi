const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("./db/mongoose");

app.use(express.json());

const journalistRouter = require("./routers/journalist");
const npRouter = require("./routers/np");
app.use(journalistRouter);
app.use(npRouter);

app.listen(port, () => {
  console.log("Server is running");
});
