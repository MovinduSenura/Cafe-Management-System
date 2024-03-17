const express = require("express");
const StockRouter = express.Router();

const { 
    addItem,
    getAllItems,
    getOneItem,
    updateItem,
    deleteItem,
} = require("../controller/stock.controller");

StockRouter.post('/api/create', addItem);
StockRouter.get('/api/items', getAllItems);
StockRouter.get('/api/item', getOneItem);
StockRouter.patch('/api/itemUpdate/:id', updateItem);
StockRouter.delete('/api/itemDelete/:id', deleteItem);

module.exports = StockRouter;