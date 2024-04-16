const express = require("express");
const promotionRouter = express.Router();

const {
    addpromotion,
    getAllpromotions,
    getOnepromotion,
    updatepromotion,
    deletepromotion,


} = require("../controller/promotion.controller");
const promotionAllRoutes = (upload) => {
promotionRouter.post('/create', upload.single("promotionItempic"), addpromotion);
promotionRouter.get('/promotions',getAllpromotions);
promotionRouter.get('/promotion/:id',getOnepromotion);
promotionRouter.patch('/promotionUpdate/:id', upload.single("promotionItempic"), updatepromotion);
promotionRouter.delete('/deletepromotion/:id',deletepromotion);

return promotionRouter
}

module.exports = promotionAllRoutes;