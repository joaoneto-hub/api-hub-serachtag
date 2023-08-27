const express = require('express');
const db = require('../firebase/firebaseConect');

const router = express.Router();

router.get('/products/:data/:categoria', async (req, res) => {
  const data = req.params.data;
  const categoria = req.params.categoria;

  try {
    const collectionRef = db.collection(data);
    const categoryDocRef = collectionRef.doc(categoria);

    const categoryDoc = await categoryDocRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    const categoryData = categoryDoc.data();

    res.status(200).json(categoryData);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).send({ error: "Erro ao buscar produtos" });
  }
});


module.exports = router;
