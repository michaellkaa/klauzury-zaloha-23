const key = 'AIzaSyDpMwOJl4_y_V5L2dz6XBBE7VPG6yalnHQ';
const apiKey = key;
const maxResultsPerPage = 40;
let abortController = new AbortController();

function getInputValue(id) {
  return encodeURIComponent(document.getElementById(id).value.trim());
}

function getSelectedBookLength() {
  const lengthSelect = document.getElementById('bookLength');
  return lengthSelect ? lengthSelect.value : null;
}

function searchBooks() {
  abortController.abort();
  abortController = new AbortController();
  const category = getInputValue('category');
  const author = getInputValue('author');
  const bookName = getInputValue('bookName');

  const apiUrl = buildApiUrl({ author, bookName, category });

  if (apiUrl === null) {
    const resultsDiv = document.getElementById('recommendations');
    resultsDiv.innerHTML = 'Provide at least one parameter.';
    return;
  }

  fetchAndDisplayResults(apiUrl);
}

async function fetchAndDisplayResults(url) {
  const resultsDiv = document.getElementById('recommendations');
  resultsDiv.innerHTML = 'Loading...';

  try {
    const response = await fetch(url, { signal: abortController.signal });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log('Full API Response:', data);

    if (!data.items) {
      console.error('No "items" property found in the API response:', data);
      resultsDiv.innerHTML = 'No results found.';
      return;
    }

    console.log('All fetched books:', data.items);

    const filteredResults = filterResultsByLength(data.items);
    displayResults(filteredResults, resultsDiv);
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsDiv.innerHTML = 'An error occurred while fetching the data.';
  }
}

function filterResultsByLength(items) {
  const bookLength = getSelectedBookLength() || 'any';

  if (bookLength === 'any') {
    return items; 
  }

  const filteredResults = items.filter(item => {
    const pageCount = item.volumeInfo.pageCount || 0;

    switch (bookLength) {
      case 'short':
        return pageCount >= 0 && pageCount <= 150;
      case 'medium':
        return pageCount >= 151 && pageCount <= 600;
      case 'long':
        return pageCount >= 601;
      default:
        return true;
    }
  });

  return filteredResults;
}

function buildApiUrl({ author, bookName, category }) {
  const baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  const queryParams = [];

  if (author) queryParams.push(`+inauthor:"${author}"`);
  if (bookName) queryParams.push(`+intitle:"${bookName}"`);
  if (category) {
    const categories = category.split(',').map(category => `+subject:"${category.trim()}"`);
    queryParams.push(...categories);
  }

  if (queryParams.length === 0) {
    return null;
  }

  const currentUrl = baseUrl + queryParams.join('') + `&maxResults=${maxResultsPerPage}&key=${apiKey}`;
  return currentUrl;
}

function displayResults(data, resultsDiv) {
  resultsDiv.innerHTML = '';
  resultsDiv.innerHTML = "<h2>Recommended Books</h2>";

  const bookLength = getSelectedBookLength() || 'any';

  if (data && data.length > 0) {
    console.log('Displaying results');


      data.forEach(item => {
      console.log('Item:', item);
      const title = item.volumeInfo.title;
      const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author';
      const pageCount = item.volumeInfo.pageCount || 'Unknown Page Count';

      const resultItem = document.createElement('div');
      resultItem.innerHTML = `${title} by ${authors}, Page Count: ${pageCount}`;
      resultsDiv.appendChild(resultItem);
    });
  } else {
    console.log('No results found:', data);
    resultsDiv.innerHTML = 'No results found.';
  }
}

document.querySelector('.button-confirm').addEventListener('click', searchBooks);
