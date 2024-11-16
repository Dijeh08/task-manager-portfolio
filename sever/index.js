import express  from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import env from "dotenv";
// import { v4 as uuidv4 } from 'uuid';
import pg from "pg";
import bcrypt from 'bcrypt';
// import passport from "passport";
import { Resend } from 'resend';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

env.config();

const _dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;
const resend = new Resend(process.env.RESEND_KEY);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
const masterKey = process.env.SECRET_KEY;
const saltRounds = 10;
const db = new pg.Client({
  user: process.env.SECRET_USER,
  host: process.env.SECRET_HOST,
  database: process.env.SECRET_DATABASE,
  password: process.env.SECRET_PASSWORD,
  port: process.env.SECRET_PORT,
});
db.connect();

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());


const result = await db.query('select * from public.todo_list ORDER BY id ASC ');
var notes = result.rows

// Get all Jokes
app.post("/all", async(req, res) => {
  const {email} = req.body
  // console.log(email)
  try {
    const notes = (await db.query('SELECT * FROM todo_list WHERE email = $1 ORDER BY id ASC ', [email])).rows;
  // console.log(notes)
  res.json(notes).status(200);
  } catch (error) {
    console.log(error);
  }
  
});

// Delete a ToDo content in the dataBase
app.delete("/note/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM todo_list WHERE id = $1', [id]);
    res.status(201).send('deleted');
  } catch (error) {
    console.log(error);
  }
  
  
});

// Post note 
app.post("/note", async(req, res) => {
  const {title, content, date, email, time} = req.body;
  // console.log(title, content, date, email, time)
  try {
    await db.query('INSERT INTO todo_list (title, content, date, email, time) VALUES($1, $2, $3, $4, $5)', [title, content, date, email, time]);
    res.status(201).send('saved');
  } catch (error) {
    res.status(400)
        .send("Failed to Fetch activity. Please try again")
  }
  
});

// Registration
app.post("/register", async(req, res) => {
  const {firstName, lastName, email, password, password_repeat} = req.body;
  // console.log(firstName, lastName, email, password, password_repeat);
  try {
    const response = (await db.query('SELECT * FROM usersdata where email= $1', [email])).rows
  // console.log(response);
  if (response.length > 0) {
    
    res.json("exist").status(201);
  } else {
    bcrypt.hash(password, saltRounds, async function(err, hash) {
      if (err) {
        console.log(err)
      } else {
        // Store hash in your password DB.
        await db.query('INSERT INTO usersdata (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, hash])
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
  // console.log(firstName, lastName, email, password);
  try {
    // Check if the email already exist in the DataBase
  const response = (await db.query('SELECT * FROM usersdata WHERE email = $1', [email])).rows
  // console.log(response)
  if (response.length === 0) {
    await db.query('INSERT INTO usersdata (email, password, firstName, lastName) VALUES ($1, $2, $3, $4)', [ email, password, firstName, lastName,]);
    res.status(201).send('true');
  } else {
    // console.log('Email exist in the DataBase')
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
  
  // console.log(email, myPlaintextPassword)
  try {
    const result = (await db.query('SELECT DISTINCT * FROM usersdata WHERE email = $1', [email])).rows
    // console.log(result[0].password)

    if (result.length > 0) {
      const hash = result[0].password;
      // Load hash from your password DB.
      bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        if (err) {
          console.log(err);
          res.json('false');
        } else {
          // result == true
          // console.log(result)
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
app.patch("/note/:id", async(req, res) => {
  const paramsID = req.params.id;
  const {title, content, time} = req.body;
  // console.log(title, content, time)
  try {
     // Gets the note with the id
    const result = await db.query('SELECT * FROM public.todo_list WHERE id = $1', [paramsID]);
    var noteToBeUpdated = result.rows

    //Updates the database
    await db.query("UPDATE todo_list SET title = $1, content = $2, time = $4 WHERE id = $3" , [title, content, paramsID, time]);
    res.status(201).send('successfully edited');
  } catch (error) {
    console.log(error)
  }
 
});

// Completed ALl
app.post("/complete/all", async(req, res) => {
  const {email} = req.body;
  try {
    const result = (await db.query('SELECT * FROM public.completed WHERE email = $1 ORDER BY id ASC ', [email])).rows;
  // console.log(result)
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
    // Get the Note
  const result = (await db.query('SELECT * FROM todo_list WHERE id = $1', [paramsID])).rows[0];
  
  // Insert Into Completed Table
  await db.query('INSERT INTO completed (id, title, content,email, date, time) VALUES ($1, $2, $3, $4, $5, $6)', [result.id, result.title, result.content, result.email, date, result.time]);

  // Remove the note from ToDO
  await db.query('DELETE FROM todo_list WHERE id = $1', [paramsID]);
  // res.json(result.rows);
  res.status(201).send('Sent to completed DataBase')
  } catch (error) {
    console.log(error)
  }
  
});

// Delete a Complete content in the dataBase
app.delete("/complete/:id", async (req, res) => {
  const paramsID = req.params.id;
  // console.log(paramsID)
  try {
    await db.query('DELETE FROM completed WHERE id = $1', [paramsID]);
    res.status(201).send('Successfully Deleted')
  } catch (error) {
    console.log(error)
  }
  
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})