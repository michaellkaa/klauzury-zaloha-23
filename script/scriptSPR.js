const selectedBooks = [];

function onBookClick(book) {
    const authorCount = selectedBooks.filter(selectedBook => selectedBook.author === book.author).length;

    if (authorCount >= 2) {
        console.log(`You can't have the same author (${book.author}) more than twice in your list.`);
        return;
    }

    const index = selectedBooks.findIndex(selectedBook => selectedBook.title === book.title);

    if (index !== -1) {
        selectedBooks.splice(index, 1);
    } else {
        if (authorCount + 1 <= 2) {
            selectedBooks.push({ title: book.title, genre: book.genre, Form: book.form, author: book.author });
        } else {
            console.log(`You can't have the same author (${book.author}) more than twice in your list.`);
        }
    }

    console.log(`Selected books: ${JSON.stringify(selectedBooks)}`);
    checksharedGenres();
}

function findRecommendations(selectedBooks, books) {
    const selectedGenres = selectedBooks.flatMap(book => book.genre);
    const selectedForms = selectedBooks.map(book => book.form);

    const authorCounts = {};
    selectedBooks.forEach(book => {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    });

    const excludedAuthors = Object.keys(authorCounts).filter(author => authorCounts[author] >= 2);

    const commonGenresAndForm = books.filter(book => {
        const commonGenres = book.genre.some(genre => selectedGenres.includes(genre));
        const commonForm = selectedForms.includes(book.form);
        return commonGenres && commonForm;
    });

    if (commonGenresAndForm.length > 0) {
        const filteredRecommendations = commonGenresAndForm.filter(book => 
            !excludedAuthors.includes(book.author) && 
            !selectedBooks.some(selectedBook => selectedBook.title === book.title)
        );
        return filteredRecommendations.length > 0 ? filteredRecommendations : commonGenresAndForm;
    } else {
        const genreRecommendations = books.filter(book => 
            book.genre.some(genre => selectedGenres.includes(genre)) &&
            !selectedBooks.some(selectedBook => selectedBook.title === book.title)
        );
        return genreRecommendations.length > 0 ? genreRecommendations : books;
    }
}

function checksharedGenres() {
    const sharedGenres = {};
    const sharedForm = {};

    selectedBooks.forEach((selectedBook, index) => {
        selectedBook.genre.forEach(genre => {
            if (sharedGenres[genre]) {
                sharedGenres[genre].push(selectedBook.title);
            } else {
                sharedGenres[genre] = [selectedBook.title];
            }
        });

        const form = selectedBook.form;
        if (sharedForm[form]) {
            sharedForm[form].push(selectedBook.title);
        } else {
            sharedForm[form] = [selectedBook.title];
        }
    });

    for (const genre in sharedGenres) {
        if (sharedGenres[genre].length >= 2) {
            console.log(`Shared genre: ${genre}, Books: ${sharedGenres[genre].join(', ')}`);
        }
    }

    for (const Form in sharedForm) {
        if (sharedForm[Form].length >= 2) {
            console.log(`Shared Form: ${Form}, Books: ${sharedForm[Form].join(', ')}`);
        }
    }
}

function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const titleElement = document.createElement('h2');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = book.author;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);

    const updateSelectedClass = () => {
        const isSelected = selectedBooks.some(selectedBook => selectedBook.title === book.title);
        bookElement.classList.toggle('selected-book', isSelected);
    };

    updateSelectedClass();

    bookElement.addEventListener('click', () => {
        onBookClick(book);
        updateSelectedClass();
    });

    return bookElement;
}

function groupBooksByTime(books) {
    const groupedBooks = {};

    books.forEach((book) => {
        const time = book.time;

        if (groupedBooks[time]) {
            groupedBooks[time].push(book);
        } else {
            groupedBooks[time] = [book];
        }
    });

    return groupedBooks;
}

function renderGroupedBooks(groups) {
    const groupedBooksDiv = document.getElementById('grouped-books');
    groupedBooksDiv.innerHTML = " "; 

    for (const time in groups) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('time-group');

        const timeHeading = document.createElement('h2');
        timeHeading.innerHTML = time;

        groupedBooksDiv.appendChild(timeHeading);

        groups[time].forEach((book) => {
            const bookElement = createBookElement(book);
            groupDiv.appendChild(bookElement);
        });

        groupedBooksDiv.appendChild(groupDiv);
    }
}

function scrollDown(x, y) {
    window.scrollBy(x, y);
}

const allBooks = inputBooks; 
const groupedBooks = groupBooksByTime(allBooks);
renderGroupedBooks(groupedBooks);

function displayRecommendedBooks(books) {
    const recommendedBooksDiv = document.getElementById('recommendations');
    recommendedBooksDiv.innerHTML = "<h2>Recommended Books</h2>";

    scrollDown(0, 150);

    const recommendations = findRecommendations(selectedBooks, books);

    if (Array.isArray(recommendations) && recommendations.length > 0) {
        recommendations.forEach((book) => {
            recommendedBooksDiv.innerHTML += "<p>" + book.title + " by " + book.author + "</p>";
        });
    } else {
        recommendedBooksDiv.innerHTML += "<p>No books found matching the criteria.</p>";
    }
}