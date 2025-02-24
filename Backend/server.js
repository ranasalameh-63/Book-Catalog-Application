const express = require("express");
const pool = require("./database");
const cors = require ("cors");
require("dotenv").config();

const app = express();
const PORT = 9000;
app.use (express.json());
app.use(cors());



//Read: to Retrieve and display a list of all books
app.get("/books", async (req , res) =>{
    try{
        const result = await pool.query("SELECT * FROM book_details WHERE is_deleted = false");
        res.json(result.rows);
    } catch (err){
        res.status(500).json({error: err.message});
    }
});


//Create: to Insert new book records into the database
app.post("/books" , async (req , res) =>{
    try{
        const {title, author, genre, publication_date, brief_description } = req.body;
        const result = await pool.query(
            "INSERT INTO book_details ( title, author, genre, publication_date, brief_description) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
            [title, author, genre, publication_date, brief_description]
        );
        res.json(result.rows[0]);
    } catch (err){
        res.status(500).json({ error : err.message});
    }
});



//Update: to  Modify existing book details
app.put("/books" , async (req , res)=>{
    try{
        const {id} = req.params;
        const {title, author, genre, publication_date, brief_description } = req.body;        
        const result = await pool.query("UPDATE book_details SET title = $1, author = $2, genre = $3,publication_date = $4, brief_description = $5 WHERE id = $6 RETURNING * ",
            [title, author, genre, publication_date, brief_description, id]
        );
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({ error : err.message});
    }
});



//Delete: to Remove a book record from the database
app.delete("/books" , async (req , res)=>{
    try{
    const {id} = req.params;
    await pool.query ("UPDATE book_details SET is_deleted = true WHERE id = $1" , [id]);
    res.json({message : "Book deleted"});
} catch(err){
    res.status(500).json({ error : err.message});
}
});




// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});