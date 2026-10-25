const bookList = document.getElementById('book-list');
const detailSection = document.getElementById('book-detail');
const detailContent = document.getElementById('detail-content');
const form = document.getElementById('book-form');
const message = document.getElementById('message');

// Helper: create an element with text inside it
function makeEl(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

// Show a success or error message under the form
function showMessage(text, type) {
  message.textContent = text;
  message.className = type; // "success" or "error"
}

// GET /api/books: load and display every book
async function loadBooks() {
  try {
    const res = await fetch('/api/books');
    const books = await res.json();

    bookList.innerHTML = '';
    books.forEach((book) => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.append(
        makeEl('h3', book.title),
        makeEl('p', `by ${book.author}`),
        makeEl('p', book.rating ? `Rating: ${book.rating}/5` : 'No rating')
      );
      card.addEventListener('click', () => loadBookDetail(book.id));
      bookList.appendChild(card);
    });
  } catch (err) {
    bookList.textContent = 'Could not load books. Is the server running?';
  }
}

// GET /api/books/:id: load one book's details
async function loadBookDetail(id) {
  try {
    const res = await fetch(`/api/books/${id}`);
    const data = await res.json();

    detailContent.innerHTML = '';
    if (!res.ok) {
      detailContent.textContent = data.error;
    } else {
      detailContent.append(
        makeEl('h3', data.title),
        makeEl('p', `Author: ${data.author}`),
        makeEl('p', data.rating ? `Rating: ${data.rating}/5` : 'No rating'),
        makeEl('p', data.description || 'No description provided.')
      );
    }
    detailSection.hidden = false;
  } catch (err) {
    detailContent.textContent = 'Could not load book details.';
    detailSection.hidden = false;
  }
}

// POST /api/books: send the form data to the server
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newBook = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    rating: document.getElementById('rating').value,
    description: document.getElementById('description').value.trim(),
  };

  try {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error, 'error');
      return;
    }

    showMessage(`"${data.title}" was added!`, 'success');
    form.reset();
    loadBooks();
  } catch (err) {
    showMessage('Could not reach the server. Please try again.', 'error');
  }
});

// Load books when the page opens
loadBooks();
