import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publication_date, setPublicationDate] = useState('');
  const [description, setDescription] = useState('');
  const [editBook, setEditBook] = useState(null);

  //// Fetch Books from Backend ////
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:9000/books');
        setBooks(response.data);
      } catch (err) {
        console.error('There was an error fetching the books!', err);
      }
    };
    fetchBooks();
  }, []);

  //// Add New Book ////
  const addBook = async () => {
    try {
      const response = await axios.post('http://localhost:9000/books', {
        title,
        author,
        genre,
        publication_date,
        description,
      });
      setBooks([...books, response.data]);
      clearForm();
    } catch (err) {
      console.error('There was an error adding the book!', err);
    }
  };

  //// Edit Book Details ////
  const editBookDetails = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPublicationDate(book.publication_date);
    setDescription(book.description);
  };

  //// Update Book ////
  const updateBook = async () => {
    if (editBook) {
      try {
        const response = await axios.put(`http://localhost:9000/books/${editBook.id}`, {
          title,
          author,
          genre,
          publication_date,
          description,
        });

        const updatedBooks = books.map((book) =>
          book.id === editBook.id ? response.data : book
        );

        setBooks(updatedBooks);
        setEditBook(null);
        clearForm();
      } catch (err) {
        console.error('There was an error updating the book!', err);
      }
    }
  };

  //// Soft Delete Book ////
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      console.error('There was an error deleting the book!', err);
    }
  };

  //// Clear Form Fields ////
  const clearForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setPublicationDate('');
    setDescription('');
  };

  return (
    <>
       <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-pink-700 mb-6"> Book List</h2>
      <div className="w-full max-w-3xl">
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="bg-pink-100 p-4 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-pink-800">{book.title}</h3>
                <p className="text-sm text-pink-600">{book.author} - {book.genre}</p>
                <p className="text-xs text-pink-500">{book.publication_date}</p>
                <p className="text-sm text-pink-700">{book.description}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => editBookDetails(book)} className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600">Edit</button>
                <button onClick={() => deleteBook(book.id)} className="bg-pink-700 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Book Form */}
      <h1 className="text-2xl font-bold text-pink-700 mt-8">{editBook ? "Edit Book" : "Add Book"}</h1>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mt-4">
        <input className="w-full p-2 border border-pink-300 rounded-lg mb-3" type="text" placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full p-2 border border-pink-300 rounded-lg mb-3" type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input className="w-full p-2 border border-pink-300 rounded-lg mb-3" type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <input className="w-full p-2 border border-pink-300 rounded-lg mb-3" type="date" value={publication_date} onChange={(e) => setPublicationDate(e.target.value)} />
        <textarea className="w-full p-2 border border-pink-300 rounded-lg mb-3" placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <button onClick={editBook ? updateBook : addBook} className="w-full bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600">
          {editBook ? "Update Book" : "Add Book"}
        </button>
      </div>
    </div>
    </>
  );
}

export default App;

