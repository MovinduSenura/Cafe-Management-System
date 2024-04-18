const express = require("express");
const profitRouter = express.Router();

const { addProfit, 
        getAllProfits,
        getOneProfit,
        updateProfit, 

    } = require("../controller/profit.controller")

profitRouter.post('/createProfit',addProfit);
profitRouter.get('/getAllProfit',getAllProfits);
profitRouter.get('/getOneProfit/:id',getOneProfit);
profitRouter.patch('/updateProfit/:id',updateProfit);

module.exports = profitRouter;
