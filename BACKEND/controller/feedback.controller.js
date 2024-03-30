
const FeedbackModel = require("../models/feedback.model");

const addFeedback = async(req,res) => {
    try{
        const {Name,Email,DayVisited,TimeVisited,Comment} = req.body;

        const newFeedbackData = {
           
            Name:Name,
            Email:Email,
            DayVisited:DayVisited,
            TimeVisited:TimeVisited,
            Comment: Comment,
        }
        const newFeedbackObj = new FeedbackModel(newFeedbackData);
        await newFeedbackObj.save();

        return res.status(200).send({
            status:true,
            message:"✨ :: Data saved successfully!"
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message: err.message
        })
    }  
}

const getAllFeedbacks = async (req,res) =>{

    try{
        const allFeedbacks = await FeedbackModel.find();

        return res.status(200).send({
            status: true,
            message:"✨:: All items are fetched!",
            AllFeedbacks: allFeedbacks,
        })  
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }   
}

const getOneFeedback = async(req,res)=>{
    try{
        const feedbackID= req.params.id;
        const feedback= await FeedbackModel.findById(feedbackID);

        return res.status(200).send({
            status:true,
            message:"✨ :: Feedback Fetched!",
            Feedback:feedback,
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }
}

const updateFeedback = async(req,res)=>{
    try{
        const feedbackID = req.params.id;
        const{Name,Email,DayVisited,TimeVisited,Comment}=req.body; 

        const feedbackData = {
            Name:Name,
            Email:Email,
            DayVisited:DayVisited,
            TimeVisited:TimeVisited,
            Comment:Comment,
        }
        const updateFeedbackObj = await FeedbackModel.findByIdAndUpdate(feedbackID,feedbackData);
        
        return res.status(200).send({
            status:true,
            message:"✨::Feedback Updated!",
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }
}

const deleteFeedback = async(req,res)=> {
    try{
        const feedbackID = req.params.id;
        const delFeedback = await FeedbackModel.findByIdAndDelete(feedbackID);
        
        return res.status(200).send({
            status: true,
            message:"✨::Feedback Deleted!",
        })
   
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }


}
module.exports = {
    addFeedback,
    getAllFeedbacks,
    getOneFeedback,
    updateFeedback,
    deleteFeedback,
}

