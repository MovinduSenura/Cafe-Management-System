const express = require("express");
const StockRouter = express.Router();

const { 
    addItem,
    getAllItems,
    getOneItem,
    updateItem,
    deleteItem,
    searchItem,
} = require("../controller/stock.controller");

StockRouter.post('/create', addItem);
StockRouter.get('/items', getAllItems);
StockRouter.get('/item/:id', getOneItem);
StockRouter.get('/searchItem', searchItem);
StockRouter.patch('/itemUpdate/:id', updateItem);
StockRouter.delete('/itemDelete/:id', deleteItem);

module.exports = StockRouter;