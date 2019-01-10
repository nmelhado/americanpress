import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { bookDetails, bookAuthors, getOtherWorks } from '../utils'

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
		return bookDetails(this.props.match.params.id, this.props.match.params.cover)
      .then((book) => {this.setState({ ...book })})
      .then(() => bookAuthors(this.state.key, this.props.match.params.backup))
      .then((authorData) => {const { authors, authorKey } = authorData; this.setState({ authors, authorKey });})
      .then(() => {
        // if you obtained an author key, look for other works by that author
        if (this.state.authorKey !== '') {
          this.otherWorks();
        }
      })
      .catch((error) => console.log(error))
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
			return bookDetails(this.props.match.params.id, this.props.match.params.cover)
        .then((book) => {this.setState({ ...book })})
        .then(() => bookAuthors(this.state.key, this.props.match.params.backup))
        .then((authorData) => {const { authors, authorKey } = authorData; this.setState({ authors, authorKey });})
        .then(() => {
          // if you obtained an author key, look for other works by that author
          if (this.state.authorKey !== '') {
            this.otherWorks();
          }
        })
        .catch((error) => console.log(error))
		}
	}

	otherWorks() {
		return getOtherWorks(this.state.authorKey)
      .then((books) => this.setState({ otherWorks: books }))
      .catch((error) => console.log(error))
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
		if (title !== '') {
			return (
				<div className="mainContent" id="bookContent">
					<div id="innerContent">
						<div id="topContent">
							{/* topContet contains cover, title, author(s), publication date, subjects, pages, format, and external links to amazon and goodreads */}
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
												<Link to={`/results/?author=${author.name}&page=1`}>{author.name}</Link>
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
												<Link to={`/results/?subject=${subject}&page=1`}>{subject}</Link>
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
						// other works provides a horizontaly scrolling list of other works by the author
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
						// Some books have no info and so this message is provided as an explination (instead of showing a blank page).  It is triggered when this.state.cover (this happens no matter what) changes and no title is given
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
							{/* Loading image while the info is retrieved from the API call */}
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
