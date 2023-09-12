const searchBtn = document.getElementById('search-btn');
const bookList = document.getElementById('books');
const bookDetailsContent = document.querySelector('.book-details-content');
const bookCloseBtn = document.getElementById('book-close-btn');

// event listeners
searchBtn.addEventListener('click', getBookList);
bookList.addEventListener('click', getBookDetails);
bookCloseBtn.addEventListener('click', () => {
    bookDetailsContent.parentElement.classList.remove('showBook');
});

// get book list based on keywords
function getBookList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const book = item.volumeInfo;
                html += `
                    <div class="book-item" data-id="${item.id}">
                        <div class="book-img">
                            <img src="${book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}" alt="book">
                        </div>
                        <div class="book-name">
                            <h3>${book.title}</h3>
                            <a href="#" class="book-btn">Get Details</a>
                        </div>
                    </div>
                `;
            });
            bookList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any books!";
            bookList.classList.add('notFound');
        }

        bookList.innerHTML = html;
    });
}

// get details of the selected book
function getBookDetails(e) {
    e.preventDefault();
    if (e.target.classList.contains('book-btn')) {
        let bookItem = e.target.parentElement.parentElement;
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookItem.dataset.id}`)
        .then(response => response.json())
        .then(data => bookDetailsModal(data.volumeInfo));
    }
}



// get details of the selected book
function getBookDetails(e) {
    e.preventDefault();
    if (e.target.classList.contains('book-btn')) {
        let bookItem = e.target.parentElement.parentElement;
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookItem.dataset.id}`)
        .then(response => response.json())
        .then(data => bookDetailsModal(data.volumeInfo));
    }
}

// create a modal to display book details
function bookDetailsModal(book) {
    let html = `
        <h2 class="book-title">${book.title}</h2>
        <p class="book-category">Category: ${book.categories || 'N/A'}</p>
        <div class="book-description">
            <h3>Description:</h3>
            <p>${book.description || 'No description available.'}</p>
        </div>
        <div class="book-img">
            <img src="${book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}" alt="${book.title}">
        </div>
        <div class="book-link">
            <a href="${book.previewLink || 'https://books.google.com/'}" target="_blank">View on Google Books</a>
        </div>
    `;
    bookDetailsContent.innerHTML = html;
    bookDetailsContent.parentElement.classList.add('showBook');
}
