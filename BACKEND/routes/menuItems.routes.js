const express = require("express");
const menuItemRouter = express.Router();
const cors = require('cors');

const {
    addmenuItem,
    getAllmenuItems,
    getOnemenuItem,
    searchmenuItem,
    updatemenuItem,
    deletemenuItem,
    menuItemgenerateInvoice,
} = require("../controller/menuItem.controller");

const menuAllRoutes = (upload) => {
    menuItemRouter.post('/create', upload.single("menuItemImage"), addmenuItem);
    menuItemRouter.get('/menuItems', getAllmenuItems);
    menuItemRouter.get('/menuItem/:id', getOnemenuItem);
    menuItemRouter.get('/searchmenuItem', searchmenuItem);
    menuItemRouter.patch('/menuItemUpdate/:id', upload.single("menuItemImage"), updatemenuItem);
    menuItemRouter.delete('/deletemenuItem/:id', deletemenuItem);
    menuItemRouter.get('/generate-menu-invoice', menuItemgenerateInvoice);

    return menuItemRouter
}

module.exports = menuAllRoutes;