const express = require("express");
const promotionRouter = express.Router();

const {
    addpromotion,
    getAllpromotions,
    getOnepromotion,
    updatepromotion,
    deletepromotion,


} = require("../controller/promotion.controller");

promotionRouter.post('/create',addpromotion);
promotionRouter.get('/promotions',getAllpromotions);
promotionRouter.get('/promotion/:id',getOnepromotion);
promotionRouter.patch('/promotionUpdate/:id',updatepromotion);
promotionRouter.delete('/deletepromotion/:id',deletepromotion);



module.exports = promotionRouter;