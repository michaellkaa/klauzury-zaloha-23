const bookIds = [
    "J4QUEAAAQBAJ", "UL6Cwv2Z1iQC", "qK3bDAAAQBAJ",
    "1QVPDwAAQBAJ", "ZuKTvERuPG8C", "LKwjEAAAQBAJ",
    "uukqDwAAQBAJ", "szMU9omwV0wC", "GynbBQAAQBAJ", "o7EDEAAAQBAJ"
];

const booksContainer = document.getElementById('books-container');
const recommendedContainer = document.getElementById('recommended-container');
const selectedBooks = [];

async function fetchBookDetails(bookId) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    try {
        console.log(`Fetching book details for book ID: ${bookId}`);
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
}

async function displayBooks() {
    for (const bookId of bookIds) {
        const bookDetails = await fetchBookDetails(bookId);
        if (bookDetails) {
            const bookElement = createBookElement(bookDetails);
            booksContainer.appendChild(bookElement);
        }
    }
}

function createBookElement(bookDetails) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const titleElement = document.createElement('h2');
    titleElement.textContent = bookDetails.volumeInfo.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${bookDetails.volumeInfo.authors}`;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);

    bookElement.addEventListener('click', () => selectBook(bookDetails, bookElement));

    return bookElement;
}

function selectBook(bookDetails, bookElement) {
    const index = selectedBooks.findIndex(book => book.id === bookDetails.id);
    if (index === -1) {
        selectedBooks.push(bookDetails);
        bookElement.classList.add('selected-book');
    } else {
        selectedBooks.splice(index, 1);
        bookElement.classList.remove('selected-book');
    }
}

async function showRecommendedBooks() {
    console.log('Button clicked');
    const selectedCategories = [];
    selectedBooks.forEach(book => {
        if (book.volumeInfo.categories) {
            selectedCategories.push(...book.volumeInfo.categories);
        }
    });

    const uniqueCategories = selectedCategories.filter((category, index) => {
        return selectedCategories.indexOf(category) === index;
    });

    uniqueCategories.sort();

    const recommendedBooks = await getRecommendedBooks(uniqueCategories);

    recommendedContainer.innerHTML = ''; 
    recommendedContainer.innerHTML = "<h2>Recommended Books</h2>";

    recommendedBooks.forEach(book => {
        const recommendationElement = document.createElement('p');
        recommendationElement.textContent = `${book.volumeInfo.title} by ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}`;
        recommendedContainer.appendChild(recommendationElement);
    });
    console.log(uniqueCategories);
}

async function getRecommendedBooks(selectedCategories) {
    try {
        const fallbackCategory = 'fiction';
        const dynamicTopic = selectedCategories.length > 0 ? selectedCategories[0] : fallbackCategory;

        const searchQuery = `subject:${dynamicTopic}`;

        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch recommended books. Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Recommended Books Data:', data);

        return data.items || [];
    } catch (error) {
        console.error('Error fetching recommended books:', error);
        return [];
    }
}

displayBooks();
