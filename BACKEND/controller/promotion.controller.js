const promotionModel = require("../models/promotion.model");
const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time
const paymentModel = require("../models/payment.model");//payment model

//Add / Create promotion router controller
const addpromotion = async (req, res) => {
    try{

   
        const{promotionName,promotionValues,promotionDescription} = req.body;
        
        const  promotionItempic = req.file.filename; //Extract the filename from the uploaded file

        const newpromotionData = {
           
            promotionName: promotionName,
            promotionValues: promotionValues,
            promotionDescription: promotionDescription,
            promotionItempic: promotionItempic,
        }

        const newpromotionobj = new promotionModel(newpromotionData);
        await newpromotionobj.save();
       
        await res.status(200).send({
            status: true,
            message:"✨ :: Data saved successfuly!"
        })

        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message
            })
        }
    }
    
    //Calculating most used promotion in payments
    const calculateMostUsedPromotion = async () => {
        try {
            const mostUsedPromotion = await paymentModel.aggregate([
                { $match: { promotionID: { $exists: true, $ne: "" } } },
                { $group: { _id: "$promotionID", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);
    
            return mostUsedPromotion[0]._id;
        } catch (error) {
            console.error("Error calculating most used promotion:", error);
            throw error;
        }
    };
       


    //get all promotion router controller
    const getAllpromotions = async (req,res)=> {
    
       try{

        const allpromotions = await promotionModel.find();

        // Calculate most used promotion
        const mostUsedPromotionID = await calculateMostUsedPromotion();
        

        // Add a flag to each promotion indicating if it's the most used promotion
        const promotionsWithFlags = allpromotions.map(promotion => ({
            ...promotion.toObject(),
            isMostUsed: promotion._id.toString() === mostUsedPromotionID
        }));
        

        return res.status(200).send({
            status: true,
            message:"✨::All items are fetched!",
            Allpromotions: promotionsWithFlags,
            mostUsedPromotionID
        })

        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,
        })
    }

    }
    // //get all promotion router controller
    // const getAllpromotions = async (req,res)=> {
    
    //    try{

    //     const allpromotions = await promotionModel.find();

    //     return res.status(200).send({
    //         status: true,
    //         message:"✨::All items are fetched!",
    //         Allpromotions: allpromotions,
    //     })

    //     }catch(err){
    //         return res.status(500).send({
    //             status: false,
    //             message:err.message,
    //     })
    // }

    // }
    //get one specified promotion router controller
    const getOnepromotion = async (req, res) => {

        try{

            const promotionID = req.params.id;
            const promotion = await promotionModel.findById(promotionID);

            return res.status(200).send({
                status: true,
                message:"✨::promotion fetched!",
                Promotion: promotion,
        })
      
    }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,

            })
        }
    }   
    
    // Function to generate and serve the PDF invoice
const promotiongenerateInvoice = async (req, res) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/Promotion-invoice-template.html'), 'utf-8');
        // console.log(htmlTemplate);
       
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Item_Management_' + timestamp + '_doc' + '.pdf';
     
        const promotions = await promotionModel.find({});
        // console.log("promotions : ", promotions);

        let promotionArray = [];

        promotions.forEach(i => {
            // const totalPrice = i.itemQty * i.itemPrice; // Calculate total price for each item
            const it = {
                promotionName: i.promotionName,
                promotionValues: i.promotionValues, 
                promotionDescription:i.promotionDescription,
                // totalPrice: totalPrice // Include the total price in the item object
            }
            promotionArray.push(it);
        })
       
        // Calculate the total amount by reducing the items array
        // const grandTotal = promotionArray.reduce((total, item) => total + item.totalPrice, 0); //0: This is the initial value of total. In this case, it starts at 0.

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
                promotionArray,
                // grandTotal,
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
    
    //update promotion details router controller

    const updatepromotion =async (req,res)=>{
     
        try{

            const promotionID = req.params.id;
            const{promotionName,promotionValues,promotionDescription} = req.body;

            const promotionData = {
                promotionName:promotionName,
                promotionValues:promotionValues,
                promotionDescription:promotionDescription,
                // promotionItempic:promotionItempic,

            }

         // Check if file exists in the request then only send image with itemData object
            if (req.file) {
                promotionData.promotionItempic = req.file.filename; // Extract the filename from the uploaded file
            }

            const updatepromotionobj = await promotionModel.findByIdAndUpdate(promotionID,promotionData);

            return  res.status(200).send({
                status: true,
                message: "✨:: promotion Updated!",

            }) 
            
        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,

        })

    }   

    }

    //Delete promotion router controller
    const deletepromotion = async (req,res)=>{

        try{

            const promotionID= req.params.id;
            const delpromotion = await promotionModel.findByIdAndDelete(promotionID);

            return res.status(200).send({
                status: true,
                message: "✨:: promotion Delete!",
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message:err.message,

    })

}
}

//get - search particular promotion
const searchPromotion = async (req, res) => {

    try{

        const promotionName = req.query.promotionName;
        // Using a regular expression to match partial game names
        const promotionItem = await promotionModel.find({ promotionName: { $regex: `^${promotionName}`, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

        return res.status(200).send({
            status: true,
            message: "✨ :: Project Searched and fetched!",
            searchedPromotion: promotionItem
        })

    }catch(err){

        return res.status(500).send({
            status: false,
            message: err.message
        });

    }

}

    module.exports = {
        addpromotion,
        getAllpromotions,
        getOnepromotion,
        promotiongenerateInvoice,
        updatepromotion,
        deletepromotion,
        searchPromotion,
    }

