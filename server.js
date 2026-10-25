const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const books = [
  {
    id: 1,
    title: 'Slaughterhouse-five',
    author: 'Kurt Vonnegut',
    rating: 3,
    description: 'This is sample data 1',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    rating: 5,
    description: 'This is sample data 2',
  },
  {
    id: 3,
    title: 'As I Lay Dying',
    author: 'William Faulkner',
    rating: 4,
    description: 'This is sample data 3',
  },
  {
    id: 4,
    title: 'THE ROAD',
    author: 'Cormac McCarthy',
    rating: 3,
    description: 'This is sample data 4',
  },
  {
    id: 5,
    title: 'The Metamorphsis',
    author: 'Franz Kafka',
    rating: 1,
    description: 'This is sample data 5',
  },
];

//GET all the books
app.get('/api/books', (req, res) => {
  res.json(books);
});

//GET one book by id
app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res
      .status(404)
      .json({ error: `No book found with id ${req.params.id}.` });
  }

  res.json(book);
});

//POST new book
app.post('/api/books', (req, res) => {
  const { title, author, rating, description } = req.body || {};
  //The two required fields are title and author
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required.' });
  }
  //rating has to be between 1 & 5, similar to a five star rating
  if (rating !== undefined && rating !== '') {
    const num = Number(rating);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
      return res
        .status(400)
        .json({ error: 'Rating must be a whole number from 1 to 5.' });
    }
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    rating: rating ? Number(rating) : null,
    description: description || '',
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
