const itemModel = require("../models/item.model");
const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time
const nodemailer = require("nodemailer");

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

// Function to generate and serve the PDF invoice
const stockgenerateInvoice = async (req, res) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/stock-invoice-template.html'), 'utf-8');
        // console.log(htmlTemplate);
       
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Item_Management_' + timestamp + '_doc' + '.pdf';
     
        const items = await itemModel.find({});
        // console.log("items : ", items);

        let itemArray = [];

        items.forEach(i => {
            // const totalPrice = i.itemQty * i.itemPrice; // Calculate total price for each item
            const it = {
                itemName: i.itemName,
                quantity: i.quantity,
                currentstocklevel: i.currentstocklevel,
                // totalPrice: totalPrice // Include the total price in the item object
            }
            itemArray.push(it);
        })
       
        // Calculate the total amount by reducing the items array
        // const grandTotal = itemArray.reduce((total, item) => total + item.totalPrice, 0); //0: This is the initial value of total. In this case, it starts at 0.

        // Taking logo path
        const logoPath = path.join(__dirname, '../template/images/logo.png');
        // Load the logo image asynchronously
        const logoBuffer = await fs.promises.readFile(logoPath);
        // Encode the logo buffer to base64
        const logoBase64 = logoBuffer.toString('base64');

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

        const document = {
            html: htmlTemplate,
            data: {
                itemArray,
                logoBuffer: logoBase64, // Pass the logo buffer to the HTML template
            },
            path: './docs/' + filename,
        };

        const pdfBuffer = await pdfCreator.create(document, options);

        const filepath = 'http://localhost:8000/docs/' + filename;

        // Send the file path in the response
        res.status(200).json({ filepath });
        // res.contentType('application/pdf');
        // res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};

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

// Function to send low stock email
async function sendLowStockEmail(lowStockItems) {
    try {
        // Create a transporter using Gmail's SMTP
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'managercafe4@gmail.com', // sender Gmail address
                pass: 'ltec rydi auyw hlzk', // sender Gmail password or App Password if 2-step verification is enabled
            },
        });

        // Generate HTML content for low stock items
        let htmlContent = "<p>Dear Manager,</p><p>The following items are currently low in stock:</p><ul>";
        lowStockItems.forEach(item => {
            htmlContent += `<li>${item.itemName} - Current Stock: ${item.currentstocklevel}, Minimum Stock Level: ${item.minstocklevel}</li>`;
        });
        htmlContent += "</ul><p>Please take appropriate action to replenish the stock.</p><p>Regards,<br>Cafe Espresso Elegance Pvt Ltd</p>";

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'managercafe4@gmail.com', // Sender address
            to: "it22032560@my.sliit.lk", // List of receivers
            subject: "Low Stock Alert!", // Subject line
            html: htmlContent, // HTML body
        });

        console.log("Low stock email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending low stock email:", error);
        // Handle errors if email sending fails
    }
}


// Function to periodically check stock levels
function checkStockLevels() {
    setInterval(async () => {
        try {
            // Fetch all items from the database
            const allItems = await itemModel.find();

            // Filter low stock items
            const lowStockItems = allItems.filter(item => item.currentstocklevel < item.minstocklevel);

            if (lowStockItems.length > 0) {
                // Trigger email notification for low stock items
                await sendLowStockEmail(lowStockItems);
            }
        } catch (error) {
            console.error("Error checking stock levels:", error);
        }
    }, 24 * 60 * 60 * 1000); // Check stock levels every 24 hours
}

// Call the function to start checking stock levels
checkStockLevels();



module.exports = {
    addItem,
    getAllItems,
    getOneItem,
    searchItem,
    updateItem,
    deleteItem,
    stockgenerateInvoice,
}