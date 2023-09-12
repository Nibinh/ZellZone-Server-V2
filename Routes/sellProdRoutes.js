const express = require("express");
const router = express.Router();

const sellProductController = require("../Controller/sellProdController");

router.get("/veiwall/:id", sellProductController.viewAllSellProd);

module.exports = router;
