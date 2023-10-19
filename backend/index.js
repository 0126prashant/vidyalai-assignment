const express = require('express');
const app = express();

const cors = require('cors');
const router = require('./routes/pdfroutes');

app.use(cors());

app.use(express.json());

app.use("/",router)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
