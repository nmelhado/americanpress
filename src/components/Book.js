import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Book extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			description: '',
			authors: [],
			subjects: [],
			format: '',
			published: '',
			pages: 0,
			amazon: '',
			goodreads: '',
			cover: '',
			key: '',
			authorKey: '',
			otherWorks: []
		};
		this.otherWorks = this.otherWorks.bind(this);
	}

	componentDidMount() {
		return axios
			.get(
				`http://openlibrary.org/query.json?type=/type/edition&*=&limit=50&languages=/languages/eng&works=/works/${this
					.props.match.params.id}`
			)
			.then((res) => {
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
				console.log(books);
				if (books[0]) {
					return books[0];
				}
				return { title: '', authors: [] };
			})
			.then((work) => {
				const book = { title: work.title };
				book['key'] = work.key ? work.key.split('books/')[1] : '';
				book['cover'] = this.props.match.params.cover
					? `https://covers.openlibrary.org/b/ID/${this.props.match.params.cover}-L.jpg`
					: '/nia.jpg';
				if (work.identifiers && work.identifiers['amazon.co.uk_asin']) {
					book['amazon'] = work.identifiers['amazon.co.uk_asin'][0];
				}
				if (work.identifiers && work.identifiers['goodreads']) {
					book['goodreads'] = work.identifiers['goodreads'][0];
				}
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
					book['authorKey'] = work.authors[0].key;
				}
				if (work.description) {
					book['description'] = work.description;
				} else {
					book['description'] = 'No description available.';
				}
				return book;
			})
			.then((book) => this.setState({ ...book }))
			.then(() => {
				if (this.state.authors.length === 0) {
					return axios.get(
						`https://openlibrary.org/api/books?bibkeys=${this.state.key
							? this.state.key
							: this.props.match.params.backup
								? this.props.match.params.backup
								: ''}&format=json&jscmd=data`
					);
				} else {
					const empty = { data: {} };
					empty.data[this.props.match.params.backup] = {};
					return empty;
				}
			})
			.then(
				(res) =>
					this.state.authors.length === 0 && (this.state.key || this.props.match.params.backup)
						? res.data[this.state.key ? this.state.key : this.props.match.params.backup]
						: {}
			)
			.then((book) => (this.state.authors.length === 0 ? (book.authors ? book.authors : []) : null))
			.then((authors) => {
				if (this.state.authors.length === 0) {
					let authorKey = '';
					if (authors[0].url) {
						authorKey = `/authors/${authors[0].url.split('authors/')[1].split('/')[0]}`;
					}
					this.setState({ authors, authorKey });
				}
			})
			.then(() => {
				if (this.state.authorKey !== '') {
					this.otherWorks();
				}
			})
			.catch((error) => console.log(error));
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params !== this.props.match.params) {
			this.setState({
				title: '',
				description: '',
				authors: [],
				subjects: [],
				format: '',
				published: '',
				pages: 0,
				amazon: '',
				goodreads: '',
				cover: '',
				key: '',
				authorKey: '',
				otherWorks: []
			});
			window.scrollTo(0, 0);
			return axios
				.get(
					`http://openlibrary.org/query.json?type=/type/edition&*=&limit=50&languages=/languages/eng&works=/works/${this
						.props.match.params.id}`
				)
				.then((res) => {
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
					console.log(books);
					if (books[0]) {
						return books[0];
					}
					return { title: '', authors: [] };
				})
				.then((work) => {
					const book = { title: work.title };
					book['key'] = work.key ? work.key.split('books/')[1] : '';
					book['cover'] = this.props.match.params.cover
						? `https://covers.openlibrary.org/b/ID/${this.props.match.params.cover}-L.jpg`
						: '/nia.jpg';
					if (work.identifiers && work.identifiers['amazon.co.uk_asin']) {
						book['amazon'] = work.identifiers['amazon.co.uk_asin'][0];
					}
					if (work.identifiers && work.identifiers['goodreads']) {
						book['goodreads'] = work.identifiers['goodreads'][0];
					}
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
						book['authorKey'] = work.authors[0].key;
					}
					if (work.description) {
						book['description'] = work.description;
					} else {
						book['description'] = 'No description available.';
					}
					return book;
				})
				.then((book) => this.setState({ ...book }))
				.then(() => {
					if (this.state.authors.length === 0) {
						return axios.get(
							`https://openlibrary.org/api/books?bibkeys=${this.state.key
								? this.state.key
								: this.props.match.params.backup
									? this.props.match.params.backup
									: ''}&format=json&jscmd=data`
						);
					} else {
						const empty = { data: {} };
						empty.data[this.props.match.params.backup] = {};
						return empty;
					}
				})
				.then(
					(res) =>
						this.state.authors.length === 0 && (this.state.key || this.props.match.params.backup)
							? res.data[this.state.key ? this.state.key : this.props.match.params.backup]
							: {}
				)
				.then((book) => (this.state.authors.length === 0 ? (book.authors ? book.authors : []) : null))
				.then((authors) => {
					if (this.state.authors.length === 0) {
						let authorKey = '';
						if (authors[0].url) {
							authorKey = `/authors/${authors[0].url.split('authors/')[1].split('/')[0]}`;
						}
						this.setState({ authors, authorKey });
					}
				})
				.then(() => {
					if (this.state.authorKey !== '') {
						this.otherWorks();
					}
				})
				.catch((error) => console.log(error));
		}
	}

	otherWorks() {
		return axios
			.get(
				`http://openlibrary.org/query.json?type=/type/edition&*=&limit=80&languages=/languages/eng&authors=${this
					.state.authorKey}`
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
			.then((books) => this.setState({ otherWorks: books }))
			.catch((error) => console.log(error));
	}

	render() {
		const {
			title,
			authors,
			description,
			format,
			pages,
			published,
			subjects,
			amazon,
			goodreads,
			cover,
			otherWorks
		} = this.state;
		console.log(this.state);
		if (title !== '') {
			return (
				<div className="mainContent" id="bookContent">
					<div id="innerContent">
						<div id="topContent">
							<div id="bookDisplay">
								<img
									id="bookTransformer"
									src={`/bookBack${format.toLowerCase() === 'hardcover'
										? 'Hardcover'
										: 'Paperback'}.png`}
								/>
								<img id="bookCover" src={cover} />
							</div>
							<div id="topRight">
								<h2 className="bookTitle">{title}</h2>
								<div className="bookDate">{`Published ${published}`}</div>
								{authors.length > 0 ? (
									<div className="bookAuthor">
										Author{authors.length > 1 ? 's' : ''}:{' '}
										{authors.map((author, key) => (
											<span key={key} className="authorNames">
												{key > 0 ? `${key === authors.length - 1 ? ' and ' : ', '}` : ''}
												<Link
													to={`/results/${author.url
														? author.url.split('org/authors/')[1].split('/')[0]
														: author.key.split('authors/')[1]}/1`}
												>
													{author.name}
												</Link>
											</span>
										))}
									</div>
								) : (
									''
								)}
								{subjects.length > 0 ? (
									<div className="bookSubjects">
										<h3 id="subjectHeading">Subject{subjects.length > 1 ? 's' : ''}:</h3>
										{subjects.map((subject, key) => (
											<span key={key} className="subjectNames">
												{key > 0 ? ', ' : ''}
												<Link to={`/subject/${subject}/1`}>{subject}</Link>
											</span>
										))}
									</div>
								) : (
									''
								)}
								{pages !== 0 || format !== '' ? (
									<div id="bookInfo">
										{format !== '' ? <span className="bookFormat">{format}</span> : ''}
										{pages !== 0 && format !== '' ? <span>&nbsp;-&nbsp;</span> : ''}
										{pages !== 0 ? <span className="bookPages">{`${pages} pages`}</span> : ''}
									</div>
								) : (
									''
								)}
								{goodreads !== '' ? (
									<a href={`https://www.goodreads.com/book/show/${goodreads}`} target="_blank">
										<img className="goodreadsButton" src="/goodreads.png" />
									</a>
								) : (
									''
								)}
								{amazon !== '' ? (
									<a href={`https://www.amazon.com/dp/${amazon}`} target="_blank">
										<img className="amazonButton" src="/amazon.png" />
									</a>
								) : (
									''
								)}
							</div>
						</div>
						<hr id="seperator" />
						{description !== '' ? (
							<p className="bookDescription">{description.value ? description.value : description}</p>
						) : (
							''
						)}
					</div>
					{otherWorks.length > 0 ? (
						<div className="otherWorksParent">
							<h3 className="otherWorksHeader">{`Other Works by ${authors[0].name}:`}</h3>
							<div className="otherWorks">
								{otherWorks.map((book, key) => (
									<Link
										className="workContainer"
										key={key}
										to={`/book/${book.works[0].key.split('works/')[1]}/${book.covers[0]}`}
									>
										<img
											src={`https://covers.openlibrary.org/b/ID/${book.covers[0]}-M.jpg`}
											className="otherPreview"
										/>
										<br />
										<span className="otherTitle">{book.title}</span>
									</Link>
								))}
							</div>
						</div>
					) : (
						''
					)}
				</div>
			);
		} else {
			return (
				<div className="mainContent" id="mainLoading">
					{cover !== '' ? (
						<h2 id="noContent">
							We're sorry, but there's no data available for this book!<br />
							<br />It may be linked to a different OpenLibrary book, if there are other results by the
							same title try clicking on another copy of this title to obtain more info.<br />
							<br />Sorry for the inconvenience.
						</h2>
					) : (
						''
					)}
					{cover === '' ? (
						<div id="centerBlock">
							<div className="loading-grid">
								<div />
								<div />
								<div />
								<div />
								<div />
								<div />
								<div />
								<div />
								<div />
							</div>
						</div>
					) : (
						''
					)}
				</div>
			);
		}
	}
}

export default Book;
