const express = require('express');
const app = express();
const port = 3000; 

const routes = require('./Routes/index');

app.use(routes);

app.listen(port, () => {
  console.log(` 🚀 Servidor rodando na porta ${port} 🔥`);
});
