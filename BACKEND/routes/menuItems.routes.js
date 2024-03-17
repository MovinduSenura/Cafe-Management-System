const express = require("express");
const menuItemRouter = express.Router();

const {
    addmenuItem,
    getAllmenuItems,
    getOnemenuItem,
    updatemenuItem,
    deletemenuItem,
    

} = require("../controller/menuItem.controller");

menuItemRouter.post('/create', addmenuItem);
menuItemRouter.get('/menuItems', getAllmenuItems);
menuItemRouter.get('/menuItem/:id ', getOnemenuItem);
menuItemRouter.patch('/menuItemUpdate/:id ', updatemenuItem);
menuItemRouter.delete('/deletemenuItem/:id ', deletemenuItem);


module.exports = menuItemRouter;