function nextPage() {
    var bookType = document.querySelector('input[name="bookType"]:checked').value;
    var url = "";

    if(bookType === 'school') {
        url = 'indexChoice.html';
        localStorage.setItem('setPage', '1'); // Uloží hodnotu v localStorage
    } else {
        url = 'indexChoice.html';
        localStorage.setItem('setPage', '2'); // Uloží hodnotu v localStorage
    }

    if (url) {
        window.location.href = url;
    }
}

// Funkce, která při stisknutí tlačítka vykoná funkci, ktrá nás přenese na jednu ze 4 výběrových html file
function submitSelection() {
    var recommendationMethod = document.querySelector('input[name="recommendationMethod"]:checked').value;
    var url = "";
    var setPage = localStorage.getItem('setPage'); // Bere hodnotu z localStorage

    if (setPage === '1') { 
        if (recommendationMethod === 'formFilter') {
            url = 'schoolFormFilter.html';
        } else if (recommendationMethod === 'previouslyRead') {
            url = 'schoolPreviouslyRead.html';
        }
    } else if (setPage === '2') {
        if (recommendationMethod === 'formFilter') {
            url = 'worldwideFormFilter.html';
        } else if (recommendationMethod === 'previouslyRead') {
            url = 'worldwidePreviouslyRead.html';
        }
    }

    if (url) {
        window.location.href = url;
    }
}

//Form filter na maturitní četbu
document.getElementById('bookFilterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('lgenre').value;
    const druh = document.getElementById('druh').value;
    const time = document.getElementById('time').value;

    try {
        if (!name && !author && !genre && !druh) {
            throw new Error('Please provide at least one filter criteria.');
        }

        console.log(name, author, genre, druh);
        var recommendations = recommendBooks(name, author, genre, druh, time);
        displayRecommendations(recommendations);
    } catch (error) {
        displayError(error.message);
    }
   
}); 

function displayError(message) {
    var errorDiv = document.getElementById('recommendations');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error';
        document.body.appendChild(errorDiv);
    }

    errorDiv.innerHTML = "<p style='color: red;'>" + message + "</p>";

    setTimeout(function () {
        errorDiv.innerHTML = '';
    }, 5000);
}

function updateGenreOptions() {
    const druhSelect = document.getElementById('druh');
    const genreSelect = document.getElementById('lgenre');
    const timeSelect = document.getElementById('time');

    const selectedDruh = druhSelect.value;

    let genreOptions = ['All', 'Svatá kniha', 'Novela', 'Pikareskní román', 'Filosofický román', 'Dopisníkový román', 'Epos', 'Komedie', 'Tragédie', 'Sonet', 'Balada', 'Romaneto', 'Sociální román', 'Sbírka básní', 'Gotický román', 'Básnická povídka', 'Psychologický román', 'Elegie', 'Pověst', 'Báseň', 'Povídka', 'Hororový román','Detektivní román', 'Vědeckofantastický román', 'Autobiografický román', 'Dystopický román', 'Postapokalyptický román', 'Rodinný román', 'Surrealistický román', 'Alegorický román', 'Fantasy', 'Deník', 'Krátké povídky'];
    let timeOptions = ['All', 'Světová a česká literatura do konce 18. století', 'Světová a česká literatura 19. století', 'Světová literatura 20. a 21. století', 'Česká literatura 20. a 21. století'];

    if (selectedDruh === 'epika') {
        genreOptions = ['All', 'Svatá kniha', 'Novela', 'Pikareskní román', 'Filosofický román', 'Dopisníkový román', 'Epos', 'Romaneto', 'Sociální román', 'Gotický román', 'Psychologický román', 'Pověst', 'Povídka', 'Hororový román','Detektivní román', 'Vědeckofantastický román', 'Autobiografický román', 'Dystopický román', 'Postapokalyptický román', 'Rodinný román', 'Surrealistický román', 'Alegorický román', 'Fantasy', 'Deník', 'Krátké povídky'];
    } else if (selectedDruh === 'lyrika') {
        genreOptions = ['All', 'Sonet', 'Elegie', 'Báseň'];
    } else if (selectedDruh === 'drama') {
        genreOptions = ['All', 'Komedie', 'Tragédie'];
    } else if (selectedDruh === 'all-druh') {
        genreOptions = ['All', 'Svatá kniha', 'Novela', 'Pikareskní román', 'Filosofický román', 'Dopisníkový román', 'Epos', 'Komedie', 'Tragédie', 'Sonet', 'Balada', 'Romaneto', 'Sociální román', 'Sbírka básní', 'Gotický román', 'Básnická povídka', 'Psychologický román', 'Elegie', 'Pověst', 'Báseň', 'Povídka', 'Hororový román','Detektivní román', 'Vědeckofantastický román', 'Autobiografický román', 'Dystopický román', 'Postapokalyptický román', 'Rodinný román', 'Surrealistický román', 'Alegorický román', 'Fantasy', 'Deník', 'Krátké povídky'];
    }
    else if (selectedDruh === 'lyricko-epicke') {
        genreOptions = ['All', 'Básnická povídka', 'Balada'];
    }

    if (genreSelect) {
        genreSelect.innerHTML = '';
    }
    timeSelect.innerHTML = ''; 

    genreOptions.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (genreSelect) {
            genreSelect.appendChild(optionElement);
        }
    });

    timeOptions.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        timeSelect.appendChild(optionElement);
    });
}

function recommendBooks(name, author, genre, druh, time) {
    console.log("Filter Criteria:", name, author, genre, druh, time); 

    const filteredByDruh = books.filter(function (book) {
        if (druh === 'all-druh' || druh === 'All') {
            return true;
        }

        if (book.druh.includes('all-druh')) {
            return true;
        }

        return book.druh.includes(druh);
    });

    const filteredByGenre = filteredByDruh.filter(function (book) {
        if ((genre === 'all-genre' || genre === 'All')) {
            return true;
        }

        if (book.genre.includes('all-genre')) {
            return true;
        }

        return book.genre.includes(genre);
    });

    const filteredByTime = filteredByGenre.filter(function (book) {
        if (!time || time === 'all-time' || time === 'All') {
            return true;
        }
    
        return book.time.includes(time);
    });

    return filteredByTime.filter(function (book) {
        const matchesName = !name || book.name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(name.toLowerCase().trim());
        const matchesAuthor = !author || book.author.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(author.toLowerCase().trim());

        return matchesName && matchesAuthor;
    });
}

function scrollDown(x, y) {
    window.scrollBy(x, y);
}

function displayRecommendations(recommendations) {
    var recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = "<h2>Recommended Books</h2>";
    recommendationsDiv.innerHTML += 'Loading...';

    recommendationsDiv.onchange = (scrollDown(0, 150));

    if (Array.isArray(recommendations) && recommendations.length > 0) {
        setTimeout(() => { 
            recommendationsDiv.innerHTML = '';
            recommendationsDiv.innerHTML = "<h2>Recommended Books</h2>";
            recommendations.forEach((book) => {
                recommendationsDiv.innerHTML += "<p>" + book.title + " by " + book.author + "</p>";
            });
        }, 1100); 
    } else {
        recommendationsDiv.innerHTML = "<p>No books found matching the criteria.</p>";
    }
}