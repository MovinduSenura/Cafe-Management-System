const express = require("express")
const tablesRouter = express.Router();

const {
    getAllTables
} = require("../controller/table.controller")

tablesRouter.post('/', getAllTables)

module.exports = tablesRouter;