import axios from 'axios';

const browseQuery = (authorParam, search, title, page) => {
	const link = `http://openlibrary.org/search.json?${authorParam ? `author=${authorParam}` : ''}${title
		? `${authorParam ? '&' : ''}title=${title}`
		: ''}${search ? `q=${search}` : ''}`;
	return (
		axios
			// return 15 results at a time
			.get(`${link}&page=${page}&limit=15`)
			.then((res) => {
				const result = { total: res.data.num_found, books: res.data.docs };
				return result;
			})
			.catch((error) => console.log(error))
	);
};

const browseSubject = (subject, page) => {
	const link = `http://openlibrary.org/subjects/${subject.replace(' ','_').toLowerCase()}.json?offset=${(page - 1) * 15}&limit=15`;
	return (
		axios
			// return 15 results at a time
			.get(link)
			.then((res) => {
				const result = { total: res.data.work_count, books: res.data.works };
				return result;
			})
			.catch((error) => console.log(error))
	);
};

const pullAuthorsQuery = (authorParam, search, title) => {
	const link = `http://openlibrary.org/search.json?${authorParam ? `author=${authorParam}` : ''}${title
		? `${authorParam ? '&' : ''}title=${title}`
		: ''}${search ? `q=${search}` : ''}`;
	return axios
		.get(`${link}&limit=9000`)
		.then((res) => res.data.docs)
		.then((books) => {
			// Haven't determined if subjects can be used to filter search API, haven't found a way yet.  Still pulling them in case it's possible.
			let info = { subject: new Set() };
			books.filter((book) => book.subject).forEach((book) =>
				book.subject.forEach((subject, ix) => {
					if (ix < 5) {
						info['subject'].add(subject);
					}
				})
			);
			if (authorParam && (authorParam !== '' && authorParam !== null)) {
			} else {
				info['authors'] = new Set(books.filter((book) => book.author_name).map((book) => book.author_name[0]));
				const authors = [];
				info['authors'].forEach((author) => authors.push({ label: author, value: author }));
				info['authors'] = authors;
			}
			return info;
		})
		.then((info) => {
			return info;
		})
		.catch((error) => console.log(error));
};

const bookDetails = (id, cover ) => {
  return (
    axios
      .get(
        `http://openlibrary.org/query.json?type=/type/edition&*=&limit=50&languages=/languages/eng&works=/works/${id}`
      )
      .then((res) => {
        // the api call typically returns many versions of the same book.  The following chain of filters attempts to isolate results that have as much info as possible.
        let books = res.data.filter((book) => book.authors && book.description && book.subjects);
        if (books.length > 0) {
          return books.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        } else {
          books = res.data.filter((book) => book.description && book.subjects);
        }
        if (books.length > 0) {
          return books.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        } else {
          books = res.data.filter((book) => book.description);
        }
        if (books.length > 0) {
          return books.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        } else {
          books = res.data.filter((book) => book.authors);
        }
        return res.data;
      })
      .then((books) => {
        if (books[0]) {
          return books[0];
        }
        return { title: '', authors: [] };
      })
      .then((work) => {
        const book = { title: work.title };
        book['key'] = work.key ? work.key.split('books/')[1] : '';
        // choose cover based on search result cover, NOT specific work selected above
        book['cover'] = cover
          ? `https://covers.openlibrary.org/b/ID/${cover}-L.jpg`
          : '/nia.jpg';
        // used to create an amazon link to he book
        if (work.identifiers && work.identifiers['amazon.co.uk_asin']) {
          book['amazon'] = work.identifiers['amazon.co.uk_asin'][0];
        }
        // used to create a goodreads link to he book
        if (work.identifiers && work.identifiers['goodreads']) {
          book['goodreads'] = work.identifiers['goodreads'][0];
        }
        // Check if the format is harcover, paperback, massmarket, etc.
        if (work.physical_format) {
          book['format'] = work.physical_format;
        }
        if (work.publish_date) {
          book['published'] = work.publish_date;
        }
        if (work.number_of_pages) {
          book['pages'] = work.number_of_pages;
        }
        if (work.subjects) {
          book['subjects'] = work.subjects;
        }
        if (work.authors && work.authors[0]) {
          // author key is used to pull up other works by the same author
          book['authorKey'] = work.authors[0].key;
        }
        if (work.description) {
          book['description'] = work.description;
        } else {
          book['description'] = 'No description available.';
        }
        return book;
      })
      .catch((error) => console.log(error))
  );
}

      // following API call returns the authors (due to the fact that the above API call does not return author names)
const bookAuthors = (key, backup) => {
  return (
    axios
      .get(
          `https://openlibrary.org/api/books?bibkeys=${key
            ? key
            : backup
              ? backup
              : ''}&format=json&jscmd=data`
        )
      )
      .then(
        (res) =>
          // if you have no work key and there is no backup ientifier provided, return an empty object so that the following script passes
          key || backup
            ? res.data[key ? key : backup]
            : {}
      )
      // if there is no authors key on the object, retun empty array
      .then((book) => (book.authors ? book.authors : []))
      .then((authors) => {
        let authorKey = '';
        if (authors[0].url) {
          authorKey = `/authors/${authors[0].url.split('authors/')[1].split('/')[0]}`;
        }
        return ({ authors, authorKey });
      })
      .catch((error) => console.log(error))
}

const getOtherWorks = (authorKey) => {
  return (
    axios
      // Search for other works by the author and, like above, filter the results to attempt to get results with lots of info
      .get(
        `http://openlibrary.org/query.json?type=/type/edition&*=&limit=80&languages=/languages/eng&authors=${authorKey}`
      )
      .then((res) => {
        let books = res.data.filter(
          (book) => book.authors && book.description && book.covers && book.covers[0] > -1 && book.works
        );

        if (books.length > 7) {
          return books.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        } else {
          var books2 = res.data.filter(
            (book) => book.description && book.covers && book.covers[0] > -1 && book.works
          );
        }
        if (books2.length > 7) {
          return books2.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        } else {
          var books3 = res.data.filter(
            (book) => book.authors && book.covers && book.covers[0] > -1 && book.works
          );
        }
        if (books3.length > 7) {
          return books3;
        }
        if (books.length > 0) {
          return books.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        }
        if (books2.length > 0) {
          return books2.sort(function(a, b) {
            return b.description.length - a.description.length;
          });
        }
        return books3;
      })
  )
}

export { browseQuery, browseSubject, pullAuthorsQuery, bookDetails, bookAuthors, getOtherWorks };
