const dayModel = require("../models/day.model")
const reservationModel = require("../models/reservation.model")
const nodemailer = require("nodemailer");

const getAllReservations = async (r, q) => {
    try {
        const allReservations = await reservationModel.find()

        return q.status(200).send({
            status: true,
            message: "All reservations found",
            reservations: allReservations
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error
        })
    }
}



const sendConfirmationEmail = async (recipientEmail, reservationData) => {
  try {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', //Using Gmail SMTP service
      auth: {
        user: 'managercafe4@gmail.com', // sender Gmail address
        pass: 'ltec rydi auyw hlzk',// Password of the sender's Gmail account
      }
    });

// Generate HTML content for low stock items
let htmlContent = "<p>Dear customer,</p><p>The table is booked :</p><ul>";

htmlContent += "</ul><p>Thank you for dining at Cafe Espresso Elegance.</p><p>Regards,<br>Cafe Espresso Elegance Pvt Ltd</p>";

    // Setup email data
    const mailOptions = {
      from: 'managercafe4@gmail.com', // Sender address
      to: recipientEmail,     // Recipient address
      subject: 'Reservation Booked', // Subject line
      html: htmlContent // Plain text body
      // You can also provide an HTML template for the email
      // html: '<p>Your HTML content here</p>',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};





const createReservation = async (req, res) => {
  try {
      const days = await dayModel.find({ date: req.body.date }).exec();
      
      if (days.length > 0) {
          const day = days[0];
          const table = day.tables.find(table => table._id == req.body.table);

      

        if (table) {
            // Define the reservation data here
            const reservationData = {
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email
            };
    
            // Create the reservation
            table.reservation = new reservationModel(reservationData);

              // Send confirmation email
      await sendConfirmationEmail(req.body.email, reservationData);

              table.isAvailable = false;

              await day.save();
              console.log("Reserved");
              res.status(200).send("Added Reservation");
          } else {
              console.log("Table not found");
              res.status(404).send("Table not found");
          }
      } else {
          console.log("Day not found");
          res.status(404).send("Day not found");
      }
  } catch (error) {
      console.log("Error:", error);
      res.status(500).send({
          status: false,
          message: "Error processing request"
      });
  }
};


module.exports = { getAllReservations, createReservation,  sendConfirmationEmail}