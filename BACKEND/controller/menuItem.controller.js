const menuItemModel = require("../models/menuItem.model");

//Add/Create item router controller
const addmenuItem = async (req, res) => {

    try{

        const {menuItemName, menuItemDescription, menuItemCategory, menuItemPrice, menuItemAvailability } = req.body;

        const menuItemImage = req.file.filename; //Extract the filename from the uploaded file

        const newmenuItem = {
            menuItemImage: menuItemImage,
            menuItemName: menuItemName,
            menuItemDescription: menuItemDescription,
            menuItemCategory: menuItemCategory,
            menuItemPrice: menuItemPrice,
            menuItemAvailability: menuItemAvailability,
        }

        const newmenuItemObj = new menuItemModel(newmenuItem);
        await newmenuItemObj.save();

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


//Get all items router controller
const getAllmenuItems = async (req, res) => {

    try{

        const allmenuItems = await menuItemModel.find();

        return res.status(200).send({
            status: true,
            message: "✨ :: All items are fetched",
            AllmenuItems: allmenuItems,
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }

}


//Get one-specified item router controller
const getOnemenuItem = async (req, res) => {

    try{

        const menuItemID = req.params.id;
        const menuItem = await menuItemModel.findById(menuItemID);

        return res.status(200).send({
            status: true,
            mesage: "✨ :: Item fetched!",
            MenuItem: menuItem,
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }
}


//Get search particular item
const searchmenuItem = async (req, res) => {

    try{

        const menuItemName = req.query.menuItemName;
        // Using a regular expression to match partial game names
        const menuItem = await menuItemModel.find({ menuItemName: { $regex: `^${menuItemName}`, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

        return res.status(200).send({
            status: true,
            message: "✨ :: Item Searched and fetched!",
            searchedmenuItem: menuItem
        })

    }catch(err){

        return res.status(500).send({
            status: false,
            message: err.message
        });

    }

}


//Update item details router controller
const updatemenuItem = async (req, res) => {
    
    try{

    const menuItemID = req.params.id;
    const {menuItemName, menuItemDescription, menuItemCategory, menuItemPrice, menuItemAvailability } = req.body;

    const existingmenuItem = {
        // menuItemImage: menuItemImage,
        menuItemName: menuItemName,
        menuItemDescription: menuItemDescription,
        menuItemCategory: menuItemCategory,
        menuItemPrice: menuItemPrice,
        menuItemAvailability: menuItemAvailability,
    }

    // Check if file exists in the request then only send image with itemData object
    if (req.file) {
        existingmenuItem.menuItemImage = req.file.filename; // Extract the filename from the uploaded file
    }

    const updatemenuItemObj = await menuItemModel.findByIdAndUpdate(menuItemID, existingmenuItem);

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
const deletemenuItem = async (req, res) => {

    try{

        const menuItemID = req.params.id;
        const delmenuItem = await menuItemModel.findByIdAndDelete(menuItemID);

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
    addmenuItem,
    getAllmenuItems,
    getOnemenuItem,
    searchmenuItem,
    updatemenuItem,
    deletemenuItem,
}