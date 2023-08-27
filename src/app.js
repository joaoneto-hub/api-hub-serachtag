const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./Routes/index');

const port = 3000; 

app.use(express.json());
app.use(cors())
app.use(routes)

app.listen(port, () => {
  console.log(` 🚀 Servidor rodando na porta ${port} 🔥`);
});
