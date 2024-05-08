const dayModel = require("../models/day.model");
const tableModel = require("../models/table.model")

const getAllTables = async (req, res)  => {
    var dateTime = req.body.date
    try {
        dayModel.find({ date: dateTime }).then(async (docs) => {
            console.log("CAME");
            console.log(docs);
              if (docs.length > 0) {
                // Record already exists
                console.log("Record exists. Sent docs.");
                res.status(200).send(docs[0]);
              } else {
                // Searched date does not exist and we need to create it
                const allTables = await tableModel.find()
                const day = new dayModel({
                  date: dateTime,
                  tables: allTables
                });
                console.log(day);
                day.save().then(()=> {
                    console.log("Created new datetime. Here are the default docs");
                    dayModel.find({ date: dateTime }).then((docs)=> {res.status(200).send(docs[0])}).catch((e) => {
                        res.sendStatus(400)
                    })
                }).catch((e) => {
                    console.log(e);
                    res.status(400).send("Error saving new date");
                })
              }
            
          }).catch((e) => {
            console.log(e);
            res.status(400).send("Could not search for date");
          })
    } catch(e) {
        return res.status(500).send({
            status: false,
            message: e
        })
    }
}

module.exports = { getAllTables }