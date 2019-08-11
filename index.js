// implement your API here
const express = require("express");
const db = require("./data/db");
const server = express();

//Middleware
server.use(express.json());

//Showing that the server is up and running
server.get("/", (req, res) => {
    res.send("Server Operational");
});

//POST	/api/users	Creates a user using the information sent inside the request body.
server.post("/users", (req, res)=> {
    const newUser= req.body;

    if (newUser.name && newUser.bio) {
        db.insert(newUser)
            .then(users => {
                res.status(201).json(users);
            })
            //Error if there is no name or bio
            .catch(err => {
                res.status(400).json({
                    err: err,
                    message: "Please provide name and bio for the user."
                })
            })
    } else {
        // Error when saving
            res.status(500).json({
                message: "There was an error while saving the user to the database"
            })
    }
})

//GET	/api/users	Returns an array of all the user objects contained in the database.
server.get("/users", (req, res) => {
    db.find()
    .then(users => {
        res.json(users);
    })
    //Error getting the user database
    .catch(err => {
        res.status(500).json({
            err: err,
            message: "The users information could not be retrieved." 
        });
    })
})

//GET	/api/users/:id	Returns the user object with the specified id.
server.get("/users/:id", (req, res) => {
    const {id} = req.params;
    
    if (id) {
        db.findById(id)
            .then(users => {
                res.json(users);
            })
            //Error when ID is not found
            .catch(err => {
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                });
            })

    } else {
        //Error retrieving the user
        res.status(500).json({
            message: "The user information could not be retrieved."
        });
    }

})

//DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete("/users/:id", (req, res) => {
    const {id} = req.params;

    db.remove(id)
    .then(deletedUser =>  {
        if (deletedUser){
            res.json(deletedUser);
        }
        else {
            //Error finding the user by that ID
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            });
        }
    })
    // Error removing the user
    .catch(err => {
        res.status(500).json({
            err: err,
            message: "The user could not be removed."
        })
    })
})

//PUT	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.

server.put("/users/:id", (req, res) => {
    const {id} = req.params;
    db.update(id,body)
    .then(users => {
        res.status(200).send(users[id]);
    })
    //Error finding that ID
    .catch(err => {
        res.status(404).json({
            err: err,
            message: "The user with the specified ID does not exist."
        })
    })
    //Error for missing bio or name
    // .catch(err => {
    //     res.status(400).json({
    //         err: err,
    //         message: "Please provide name and bio for the user."
    //     })
    // })
    // //Error updating the request
    // .catch(err => {
    //     res.status(500).json({
    //         err: err,
    //         message: "The user information could not be modified."
    //     })
    // })
})

//Always put the listen last
server.listen(8000, () => console.log("API running on port 8000"));