import {useState, useEffect} from 'react'
import axios from 'axios';

function App() {
const [books , setBooks] = useState ([]);
const [title , setTitle] = useState('');
const [author , setAuthor] = useState('');
const [genre , setGenre] = useState('');
const [date , setDate] = useState('');
const [description , setDescription] = useState('');
const [editBook, setEditBook] = useState(null);


//// Fetch Books from backend ////
useEffect(() => {
  const fetchBooks = async () =>{
    try {
      const response = await axios.get('http://localhost:9000/books')
      setBooks(response.data);
    } catch (err){
      console.error('There was an error fetching the book!', err);
    }
  };

  fetchBooks();
}, []);



//// Add new book ////
const addBook = async () => {
  try {
    const response = await axios.post('http://localhost:9000/books' , {title, author, genre, date, description});
    setBooks([...books, response.data]);
    setTitle('');
    setAuthor('');
    setGenre('');
    setDate('');
    setDescription('');
  } catch (err){
    console.error('There was an error adding the book!', err);
  }
};



//// Edit Book details
const editBookDetails = (book) => {
  setEditBook(null);
  setTitle('');
    setAuthor('');
    setGenre('');
    setDate('');
    setDescription('');
};



//// Update Book //// 
const updateBook = async () => {
 if (editBook) {
  try {
const response = await axios.put (`http://localhost:9000/books/${editBook.id}` , {title, author, genre, date, description});
const updatedBook = books.map(book =>
  book.id === editBook.id ? response.data : book
);
setBooks(updatedBook);
setEditBook(null);
setTitle('');
  setAuthor('');
  setGenre('');
  setDate('');
  setDescription('');
  } catch (err){
    console.error('There was an error updating the Book!', err);
  }
 }
};



//// Soft delete book ////
const deleteBook = async (id) => {
  try {
    await axios.delete(`http://localhost:9000/books/${id}`)
    setBooks(books.filter(book => book.id !== id));
  }catch (err){
    console.error('There was an error deleting the Book!', err);
  }
};






  return (
   <>
  {/* Book List */}
  <h2>Employee List</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.name} - {book.email} - {book.department}
            <button onClick={() => editBookDetails(book)}>Edit</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>



    <h1>Book List </h1>
    {/* Book Form */}
    <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="date"
        placeholder="publication date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="brief description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={editBook ? updateBook : addBook}>
        {editBook ? 'Update Book' : 'Add Book'}
      </button>
   </>
  )
}

export default App
