import express  from 'express'; //Import Express
import bodyParser from 'body-parser'; // Import Body-parser
import cors from 'cors'; // Import CORS
import env from "dotenv"; // Import Dotenv
import bcrypt from 'bcrypt'; // Import bcyrpt
// import {dirname} from 'path';
// import {fileURLToPath} from 'url';
import mongoose from 'mongoose'; // Import Mongoose
import TodoList from './models/TodoAppIncompleted.js'; // Import TodoList Schema
import CompletedTodo from './models/TodoAppCompleted.js'; // Import CompletedTodo Schema
import UserData from './models/User.js'; // Import UserData Collection Schema

env.config(); // Configure dotenv

// const _dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;
// const resend = new Resend(process.env.RESEND_KEY);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
const masterKey = process.env.SECRET_KEY;
const saltRounds = 10;


mongoose.connect(process.env.DB_URL)
.then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`))
})
.catch((error) => console.log(error))

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

// Get all Todo
app.post("/all", async(req, res) => {
  const {email} = req.body
  
  try {
    const notes = await TodoList.find({email: email}).exec();
    res.json(notes).status(200);
  } catch (error) {
    console.log(error);
  }
  
});

// Delete a ToDo content in the dataBase
app.delete("/note/:_id", async (req, res) => {
  const id = req.params._id;
 
  try {
    
    await TodoList.deleteOne({_id: id});
    
    res.status(201).send('deleted')
  } catch (error) {
    console.log(error);
  }
});

// Post note 
app.post("/note", async(req, res) => {
  const {title, content, date, email, time} = req.body;
  

  // Insert Data into TodoList MongoDB Collection
  try {
    await TodoList.create({
      title: title,
      content: content,
      date: date, 
      email: email, 
      time: time,
    });
      
    res.status(201).send('saved');
  } catch (error) {
    res.status(400)
      .send("Failed to Fetch activity. Please try again");
  }
});

// Registration
app.post("/register", async(req, res) => {
  const {firstName, lastName, email, password, password_repeat} = req.body;
 console.log('okay')

  try {
  
  const response = await UserData.find({email: email}).exec();
 
  if (response.length > 0) {
    
    res.json("exist").status(201);
  } else {
    bcrypt.hash(password, saltRounds, async function(err, hash) {
      if (err) {
        console.log(err)
      } else {
        // Store hash in your password DB.
        await UserData.create({
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: hash
        });
        res.json("saved");
      }
    });
  }
  } catch (error) {
    console.log(error);
  }
  
});

// Login via Google
app.post('/googleLogin', async(req, res) =>{
  const {firstName, lastName, email, password} = req.body
  
  try {
    // Check if the email already exist in the DataBase
   const response = await UserData.find({email: email}).exec();
 
  if (response.length === 0) {
    await UserData.create({
      email: email,
      firstname: firstName,
      lastname: lastName,
      password: password
    });
    res.status(201).send('true');
  } else {
    
    res.status(201).send('true')
  }
  } catch (error) {
    console.log(error)
  }
  
})

// Login Authentication
app.post("/login", async(req, res) => {
  const email = req.body.email;
  const myPlaintextPassword = req.body.password;
  
  try {
    const result = await UserData.find({email: email}).exec();
    

    if (result.length > 0) {
      const hash = result[0].password;
      // Load hash from your password DB.
      bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        if (err) {
          console.log(err);
          res.json('false');
        } else {
          // result == true
          
          res.json(result)
        }
      });
    } else {
      res.json('false');
    }
  } catch (error) {
    console.log(error);
  }
});

// Patch the existing notes
app.post("/note/:id", async(req, res) => {
  const paramsID = req.params.id;
 
  const {title, content, time} = req.body;
  
  try {
     // Gets the note with the id and Update
    const result = await TodoList.findByIdAndUpdate(paramsID,{title: title, content: content, date: time}).exec()
    
    res.status(201).send('successfully edited');
  } catch (error) {
    console.log(error)
  }
 
});

// Completed ALl
app.post("/complete/all", async(req, res) => {
  const {email} = req.body;
  try {
  const result = await CompletedTodo.find({email: email}).exec();
  
  res.json(result).status(201);
  } catch (error) {
    console.log(error);
  }
});

// Completed 
app.get("/complete/:id", async(req, res) => {
  const paramsID = req.params.id;
  const date = (new Date().toString())
  try {
    //   // Get the Note
    const result = await TodoList.findById(paramsID);

    // // Insert Into Completed Table
    await CompletedTodo.create({
      title: result.title,
      content: result.content,
      email: result.email,
      date: result.date,
    });
  // // Remove the note from ToDO
  await TodoList.deleteOne({_id: paramsID})
  // // res.json(result.rows);
  res.status(201).send('Sent to completed DataBase')
  } catch (error) {
    console.log(error)
  }
  
});

// Delete a Complete content in the dataBase
app.delete("/complete/:id", async (req, res) => {
  const paramsID = req.params.id;
  
  try {
   
    await CompletedTodo.deleteOne({_id: paramsID})
    res.status(201).send('Successfully Deleted')
  } catch (error) {
    console.log(error)
  }
  
});



