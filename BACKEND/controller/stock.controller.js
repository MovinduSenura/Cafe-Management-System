const itemModel = require("../models/item.model");

//Add/Create item router Controller
const addItem = async (req, res) => {

    try{

        const { itemName, quantity, currentstocklevel, minstocklevel } = req.body;

        const newItemData = {
            itemName: itemName,
            quantity: quantity,
            currentstocklevel: currentstocklevel,
            minstocklevel: minstocklevel,
        }

        const newItemObj = new itemModel(newItemData);
        await newItemObj.save();

        return res.status(200).send({
            status: true,
            message: "✨ :: Data saved successfully!"
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

//get all item router controller
const getAllItems = async (req, res) => {

    try{
        const allItems = await itemModel.find();

        return res.status(200).send({
            status: true,
            message: "✨ :: All items are fetched!",
            AllItems: allItems,
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message: err.message,
        })
    }
}

//get one-specified item router controller
const getOneItem = async (req, res) => {
    
    try{

        const itemID = req.params.id;
        const item = await itemModel.findById(itemID);

        return res.status(200).send({
            status: true,
            message: "✨ :: Item Fetched!",
            Item: item,
        })
    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }
}

//get - search particular item
const searchItem = async (req, res) => {

    try{

        const ItemName = req.query.itemName;
        // Using a regular expression to match partial game names
        const item = await itemModel.find({ itemName: { $regex: `^${ItemName}`, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

        return res.status(200).send({
            status: true,
            message: "✨ :: Project Searched and fetched!",
            searchedItem: item
        })

    }catch(err){

        return res.status(500).send({
            status: false,
            message: err.message
        });

    }

}

//Update item details router controller
const updateItem = async (req, res) => {

    try{

        const itemID = req.params.id;
        const { itemName, quantity, currentstocklevel, minstocklevel } = req.body;

        const itemData = {
           itemName: itemName,
           quantity: quantity,
           currentstocklevel: currentstocklevel,
           minstocklevel: minstocklevel,
        }

           const updateItemObj = await itemModel.findByIdAndUpdate(itemID, itemData);

           return res.status(200).send({
               status: true,
               message: "✨ :: Item Updated!",
        })
    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }

}

//Delete item router controller
const deleteItem = async (req, res) => {
    
    try{
        const itemID = req.params.id;
        const delItem = await itemModel.findByIdAndDelete(itemID);

        return res.status(200).send({
            status: true,
            message: "✨ :: Item Deleted!",
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }
        

}


module.exports = {
    addItem,
    getAllItems,
    getOneItem,
    searchItem,
    updateItem,
    deleteItem,
}