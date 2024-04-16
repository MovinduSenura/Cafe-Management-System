const express = require("express");
const promotionRouter = express.Router();

const {
    addpromotion,
    getAllpromotions,
    getOnepromotion,
    updatepromotion,
    deletepromotion,
    searchPromotion,


} = require("../controller/promotion.controller");
const promotionAllRoutes = (upload) => {
promotionRouter.post('/create', upload.single("promotionItempic"), addpromotion);
promotionRouter.get('/promotions',getAllpromotions);
promotionRouter.get('/promotion/:id',getOnepromotion);
promotionRouter.patch('/promotionUpdate/:id', upload.single("promotionItempic"), updatepromotion);
promotionRouter.delete('/deletepromotion/:id',deletepromotion);
promotionRouter.get('/searchPromotion',searchPromotion);

return promotionRouter
}

module.exports = promotionAllRoutes;