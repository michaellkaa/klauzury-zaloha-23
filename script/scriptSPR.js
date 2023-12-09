const selectedBooks = [];

function onBookClick(book) {
    const index = selectedBooks.findIndex(selectedBook => selectedBook.title === book.title);

    if (index !== -1) {
        selectedBooks.splice(index, 1);
    } else {
        const authorCount = selectedBooks.filter(selectedBook => selectedBook.author === book.author).length;

        if (authorCount >= 2) {
            console.log(`You can't have the same author (${book.author}) more than twice in your list.`);
            return;
        }

        selectedBooks.push({ title: book.title, genre: book.genre, druh: book.druh, author: book.author });
    }

    console.log(`Selected books: ${JSON.stringify(selectedBooks)}`);
    checkSharedgenres();
}

function findRecommendations(selectedBooks, books) {
    const selectedgenres = selectedBooks.flatMap(book => book.genre);
    const selectedDruhs = selectedBooks.map(book => book.druh);

    const authorCounts = {};
    selectedBooks.forEach(book => {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    });

    const excludedAuthors = Object.keys(authorCounts).filter(author => authorCounts[author] >= 3);

    const commongenresAndDruh = books.filter(book => {
        const commongenres = book.genre.some(genre => selectedgenres.includes(genre));
        const commonDruh = selectedDruhs.includes(book.druh);
        return commongenres && commonDruh;
    });

    if (commongenresAndDruh.length > 0) {
        const filteredRecommendations = commongenresAndDruh.filter(book => 
            !excludedAuthors.includes(book.author) && 
            !selectedBooks.some(selectedBook => selectedBook.title === book.title)
        );
        return filteredRecommendations.length > 0 ? filteredRecommendations : commongenresAndDruh;
    } else {
        const genreRecommendations = books.filter(book => 
            book.genre.some(genre => selectedgenres.includes(genre)) &&
            !selectedBooks.some(selectedBook => selectedBook.title === book.title)
        );
        return genreRecommendations.length > 0 ? genreRecommendations : books;
    }
}

function checkSharedgenres() {
    const sharedgenres = {};
    const sharedDruh = {};

    selectedBooks.forEach((selectedBook, index) => {
        selectedBook.genre.forEach(genre => {
            if (sharedgenres[genre]) {
                sharedgenres[genre].push(selectedBook.title);
            } else {
                sharedgenres[genre] = [selectedBook.title];
            }
        });

        const druh = selectedBook.druh;
        if (sharedDruh[druh]) {
            sharedDruh[druh].push(selectedBook.title);
        } else {
            sharedDruh[druh] = [selectedBook.title];
        }
    });

    for (const genre in sharedgenres) {
        if (sharedgenres[genre].length >= 2) {
            console.log(`Shared genre: ${genre}, Books: ${sharedgenres[genre].join(', ')}`);
        }
    }

    for (const druh in sharedDruh) {
        if (sharedDruh[druh].length >= 2) {
            console.log(`Shared Druh: ${druh}, Books: ${sharedDruh[druh].join(', ')}`);
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