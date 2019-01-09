import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ResultLine from './ResultLine';

class Results extends Component {
	constructor() {
		super();
		this.state = {
			books: [],
			total: '',
			subjects: [],
			subject: '',
			authors: [],
			author: '',
      infoLoaded: false,
      atTop: true
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		const state = { ...this.state };
		state[e.target.name] = e.target.value;
		this.setState(state);
	}

	componentDidMount() {
		// make navbar sticky if user scrolls more than 190px down
		document.addEventListener('scroll', () => {
			const atTop = window.scrollY < 190;
			if (atTop !== this.state.atTop) {
				this.setState({ atTop });
			}
		});
		const link = `http://openlibrary.org/search.json?${this.props.match.params.author &&
		(this.props.match.params.author !== '' && this.props.match.params.author !== null)
			? `author=${this.props.match.params.author}&title`
			: 'q'}=${this.props.match.params.search}`;
		return (
			axios
				.get(`${link}&page=${this.props.match.params.page}&limit=15`)
				.then((res) =>
					this.setState({
						total: res.data.num_found,
						books: res.data.docs
					})
				)
				// This obtains a list of all authors and most common subjects for all results not just the fifteen queried above.  This will be used to filter results.
				.then(() => axios.get(`${link}&limit=9000`))
				.then((res) => res.data.docs)
				.then((books) => {
					let info = { subject: new Set() };
					books.filter((book) => book.subject).forEach((book) =>
						book.subject.forEach((subject, ix) => {
							if (ix < 5) {
								info['subject'].add(subject);
							}
						})
					);
					if (
						this.props.match.params.author &&
						(this.props.match.params.author !== '' && this.props.match.params.author !== null)
					) {
					} else {
						info['authors'] = new Set(
							books.filter((book) => book.author_name).map((book) => book.author_name[0])
						);
					}
					return info;
				})
				.then(
					(info) =>
						this.props.match.params.author &&
						(this.props.match.params.author !== '' && this.props.match.params.author !== null)
							? this.setState({ subjects: info.subjects })
							: this.setState({ subjects: info.subjects, authors: info.authors, infoLoaded: true })
				)
				.catch((error) => console.log(error))
		);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params !== this.props.match.params) {
			this.setState({
				books: [],
				total: '',
				subjects: [],
				subject: '',
				authors: [],
				author: '',
				infoLoaded: false
			});
      const link = `http://openlibrary.org/search.json?${this.props.match.params.author &&
      (this.props.match.params.author !== '' && this.props.match.params.author !== null)
        ? `author=${this.props.match.params.author}&title`
        : 'q'}=${this.props.match.params.search}`;
			return (
				axios
					.get(`${link}&page=${this.props.match.params.page}&limit=15`)
					.then((res) =>
						this.setState({
							total: res.data.num_found,
							books: res.data.docs
						})
					)
					// This obtains a list of all authors and most common subjects for all results not just the fifteen queried above.  This will be used to filter results.
					.then(() => axios.get(`${link}&limit=9000`))
					.then((res) => res.data.docs)
					.then((books) => {
						let info = { subject: new Set() };
						books.filter((book) => book.subject).forEach((book) =>
							book.subject.forEach((subject, ix) => {
								if (ix < 5) {
									info['subject'].add(subject);
								}
							})
						);
						if (
							this.props.match.params.author &&
							(this.props.match.params.author !== '' && this.props.match.params.author !== null)
						) {
						} else {
							info['authors'] = new Set(
								books.filter((book) => book.author_name).map((book) => book.author_name[0])
							);
						}
						return info;
					})
					.then(
						(info) =>
							this.props.match.params.author &&
							(this.props.match.params.author !== '' && this.props.match.params.author !== null)
								? this.setState({ subjects: info.subjects })
								: this.setState({ subjects: info.subjects, authors: info.authors, infoLoaded: true })
					)
					.catch((error) => console.log(error))
			);
		}
	}

	render() {
		const { books, total, authors, infoLoaded } = this.state;
		console.log(this.state);
		if (total !== '') {
			return (
				<div className="mainContent" id="resultContent">
					<div id="sideBar" style={{ position: this.state.atTop ? 'relative' : 'fixed', top: this.state.atTop ? 0 : '39px' }}>
            {!this.props.match.params.author ?
            <Fragment>
              <h4 className="sidebarHeading">Author</h4>
              <div className="sidebarSelectBox">
                {infoLoaded ? (
                  [ ...authors ].map((author, key) => {
                    return (
                      <Link key={key} to={`/results/${this.props.match.params.search}/1/${author}`}>
                        {author}
                      </Link>
                    );
                  })
                ) : (
                  <div className="loading-grid smallLoading">
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
                )}
              </div>
            </Fragment> : ''}
						<h4 className="sidebarHeading">Subject</h4>
						<div className="sidebarSelectBox" />
					</div>
					<div id="results" style={{ marginLeft: this.state.atTop ? "0" : "250px" }}>
						{books.map((book, key) => {
							return <ResultLine key={key} book={book} />;
						})}
					</div>
				</div>
			);
		} else {
			return (
				<div className="mainContent" id="mainLoading">
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
				</div>
			);
		}
	}
}

export default Results;
