const express = require("express");
const FeedbackRouter = express.Router();
const{
    addFeedback,
    getAllFeedbacks,
    getOneFeedback,
    updateFeedback,
    deleteFeedback,
} = require("../controller/feedback.controller");

FeedbackRouter.post('/api/create', addFeedback);
FeedbackRouter.get('/api/feedbacks', getAllFeedbacks);
FeedbackRouter.get('/api/feedback', getOneFeedback);
FeedbackRouter.patch('/api/feedbackUpdate/:id', updateFeedback);
FeedbackRouter.delete('/api/feedbackDelete/:id', deleteFeedback);

module.exports = FeedbackRouter;