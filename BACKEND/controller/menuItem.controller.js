const menuItemModel = require("../models/menuItem.model");
const OrderModel = require("../models/Order.model");
const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time


//Add/Create item router controller
const addmenuItem = async (req, res) => {
    try {
        const { menuItemName, menuItemDescription, menuItemCategory, menuItemPrice, menuItemAvailability } = req.body;

        const menuItemPrice2 = parseFloat(menuItemPrice);

        const menuItemAvailabilityBoolean = menuItemAvailability === 'true' || menuItemAvailability === true;

        // Check if any required field is missing or empty
        if (!menuItemName || !menuItemDescription || !menuItemCategory || !menuItemPrice2) {
            return res.status(400).send({
                status: false,
                message: "All fields are required."
            });
        }

        // Validate menuItemName
        if (typeof menuItemName !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemName should be a string."
            });
        }

        // Validate menuItemDescription
        if (typeof menuItemDescription !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemDescription should be a string."
            });
        }

        // Validate menuItemCategory
        if (typeof menuItemCategory !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemCategory should be a string."
            });
        }

        // Validate menuItemPrice
        if (typeof menuItemPrice2 !== 'number' || isNaN(menuItemPrice2)) {
            return res.status(400).send({
                status: false,
                message: "menuItemPrice should be a number."
            });
        }

        // Validate menuItemAvailability
        if (typeof menuItemAvailabilityBoolean !== 'boolean') {
            return res.status(400).send({
                status: false,
                message: "menuItemAvailability should be a boolean."
            });
        }

        // If all validations pass, proceed to save the data
        const menuItemImage = req.file.filename; //Extract the filename from the uploaded file
        const newmenuItem = {
            menuItemImage: menuItemImage,
            menuItemName: menuItemName,
            menuItemDescription: menuItemDescription,
            menuItemCategory: menuItemCategory,
            menuItemPrice: menuItemPrice2,
            menuItemAvailability: menuItemAvailabilityBoolean,
        }

        const newmenuItemObj = new menuItemModel(newmenuItem);
        await newmenuItemObj.save();

        return res.status(200).send({
            status: true,
            message: "✨ :: Data saved successfully!"
        });

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

//Get most popular item router controller - this function needed in getAllMenuItems router controller function
const getMostPopularItems = async () => {
    try {
        const popularItems = await OrderModel.aggregate([
            // Unwind the menuItems array to get individual menu items
            { $unwind: "$menuItems" },
            // Group by menuItem and count occurrences
            {
                $group: {
                    _id: "$menuItems",
                    count: { $sum: 1 }
                }
            },
            // Sort by count in descending order
            { $sort: { count: -1 } },
            // Limit to most popular item
            { $limit: 1 }
        ]);

        // Retrieve details of the most popular item from the MenuItemModel
        const mostPopularItemsDetails = await Promise.all(popularItems.map(async item => {
            const menuItem = await menuItemModel.findById(item._id);
            return {
                menuItemId: menuItem._id,
                menuItemName: menuItem ? menuItem.menuItemName : "Unknown",
                count: item.count
            };
        }));    

        return mostPopularItemsDetails;

    } catch (err) {
        console.error('Error retrieving most popular item:', err);
        throw err; // Let the error propagate up to the caller
    }
};


//Get all items router controller
const getAllmenuItems = async (req, res) => {

    try{

        // Fetch all menu items
        const allmenuItems = await menuItemModel.find();
       

        // Get the most popular items
        const popularItems = await getMostPopularItems();
       

        // Create a map to store popular item IDs
        const popularItemIDs = new Set(popularItems.map(item => item.menuItemId.toString()));
       

        // Add a 'popular' field to each menu item indicating popularity
        const menuItemsWithPopularity = allmenuItems.map(item => ({
            ...item.toObject(),
            popular: popularItemIDs.has(item._id.toString())
        }));
       

        return res.status(200).send({
            status: true,
            message: "✨ :: All items are fetched",
            AllmenuItems: menuItemsWithPopularity,
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

    const menuItemPrice2 = parseFloat(menuItemPrice);

        const menuItemAvailabilityBoolean = menuItemAvailability === 'true' || menuItemAvailability === true;

        // Check if any required field is missing or empty
        if (!menuItemName || !menuItemDescription || !menuItemCategory || !menuItemPrice2) {
            return res.status(400).send({
                status: false,
                message: "All fields are required."
            });
        }

        // Validate menuItemName
        if (typeof menuItemName !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemName should be a string."
            });
        }

        // Validate menuItemDescription
        if (typeof menuItemDescription !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemDescription should be a string."
            });
        }

        // Validate menuItemCategory
        if (typeof menuItemCategory !== 'string') {
            return res.status(400).send({
                status: false,
                message: "menuItemCategory should be a string."
            });
        }

        // Validate menuItemPrice
        if (typeof menuItemPrice2 !== 'number' || isNaN(menuItemPrice2)) {
            return res.status(400).send({
                status: false,
                message: "menuItemPrice should be a number."
            });
        }

        // Validate menuItemAvailability
        if (typeof menuItemAvailabilityBoolean !== 'boolean') {
            return res.status(400).send({
                status: false,
                message: "menuItemAvailability should be a boolean."
            });
        }

    const existingmenuItem = {
        menuItemName: menuItemName,
        menuItemDescription: menuItemDescription,
        menuItemCategory: menuItemCategory,
        menuItemPrice: menuItemPrice2,
        menuItemAvailability: menuItemAvailabilityBoolean,
    }

    // Check if file exists in the request then only send image with itemData object
    if (req.file) {
        existingmenuItem.menuItemImage = req.file.filename; // Extract the filename from the uploaded file
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


// Function to generate and serve the PDF invoice
const menuItemgenerateInvoice = async (req, res) => {
    try {
        // Read the HTML template for the invoice
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/menu-invoice-template.html'), 'utf-8');

        // Generate a timestamp for the filename
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = `Menu_Item_Management_${timestamp}_doc.pdf`;

        // Fetch all menu items from the database
        const menuItems = await menuItemModel.find({});

        // Initialize an array to hold the transformed menu items
        let menuItemArray = [];

        // Transform each menu item and add it to the array
        menuItems.forEach(i => {
            // Convert menuItemAvailability from true/false to "Yes"/"No"
            const menuItemAvailability = i.menuItemAvailability ? "Yes" : "No";

            const menit = {
                menuItemName: i.menuItemName,
                menuItemCategory: i.menuItemCategory,
                menuItemPrice: i.menuItemPrice,
                menuItemAvailability: menuItemAvailability, // Use "Yes" or "No" instead of true or false
            };

            // Push the transformed menu item into the array
            menuItemArray.push(menit);
        });

        // Calculate the logo path and load the logo image asynchronously
        const logoPath = path.join(__dirname, '../template/images/logo.png');
        const logoBuffer = await fs.promises.readFile(logoPath);
        // Encode the logo buffer to base64
        const logoBase64 = logoBuffer.toString('base64');

        // Set the PDF options
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            header: {
                height: '0mm',
            },
            footer: {
                height: '0mm',
            },
            zoomFactor: '1.0',
            type: 'buffer',
        };

        // Create the document object with the HTML template, data, and file path
        const document = {
            html: htmlTemplate,
            data: {
                menuItemArray,
                logoBuffer: logoBase64, // Pass the logo buffer to the HTML template
            },
            path: `./docs/${filename}`,
        };

        // Generate the PDF and save it to the specified path
        const pdfBuffer = await pdfCreator.create(document, options);

        // Build the file path URL for the response
        const filepath = `http://localhost:8000/docs/${filename}`;

        // Send the file path in the response
        res.status(200).json({ filepath });
    } catch (error) {
        console.error('Error generating PDF invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    addmenuItem,
    getAllmenuItems,
    getOnemenuItem,
    searchmenuItem,
    updatemenuItem,
    deletemenuItem,
    menuItemgenerateInvoice,
}
