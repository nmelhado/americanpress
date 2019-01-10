import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

import ResultLine from './ResultLine';
import Pagination from './Pagination';

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
			selectedOption: null,
			expanded: false,
			// The following options keep track of whether the user has
			// scrolled a certain distance or if their screen is narrower than a certain width
			atTop: true,
			narrow: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.updateScrollPosition = this.updateScrollPosition.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.expandFilter = this.expandFilter.bind(this);
	}

	handleChange(selectedOption) {
		this.props.history.push(`/results/${this.props.match.params.search}/1/${selectedOption.value}`);
	}

	componentDidMount() {
		// make filter bar (and, on small screens, the expand button) sticky when scrolling further than 190px
		window.addEventListener('scroll', this.updateScrollPosition);
		// rearranges certain elements if the screen isn't wide enough to display thijngs comfortably
		window.addEventListener('resize', this.updateWindowDimensions);
		this.updateWindowDimensions();
		// treat the main search parameter as a general query, unless an author is provoded, in which case treat it as a tite search
		const link = `http://openlibrary.org/search.json?${this.props.match.params.author &&
		(this.props.match.params.author !== '' && this.props.match.params.author !== null)
			? `author=${this.props.match.params.author}&title`
			: 'q'}=${this.props.match.params.search}`;
		return (
			axios
				// return 15 results at a time
				.get(`${link}&page=${this.props.match.params.page}&limit=15`)
				.then((res) =>
					this.setState({
						total: res.data.num_found,
						books: res.data.docs
					})
				)
				// This obtains a list of all* (*the first 9,000) authors and most common subjects for all results not just the fifteen queried above.  This will be used to filter results.
				.then(() => axios.get(`${link}&limit=9000`))
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
					if (
						this.props.match.params.author &&
						(this.props.match.params.author !== '' && this.props.match.params.author !== null)
					) {
					} else {
						info['authors'] = new Set(
							books.filter((book) => book.author_name).map((book) => book.author_name[0])
						);
						const authors = [];
						info['authors'].forEach((author) => authors.push({ label: author, value: author }));
						info['authors'] = authors;
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
				infoLoaded: false,
				atTop: true,
				selectedOption: null,
				narrow: false,
				expanded: false
			});
			// treat the main search parameter as a general query, unless an author is provoded, in which case treat it as a tite search
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
						// Haven't determined if subjects can be used to filter search API, haven't found a way yet.  Still pulling them in case it's possible.
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
							const authors = [];
							info['authors'].forEach((author) => authors.push({ label: author, value: author }));
							info['authors'] = authors;
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

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
		window.removeEventListener('scroll', this.updateScrollPosition);
	}

	updateWindowDimensions() {
		this.setState({ narrow: window.innerWidth < 860 });
	}

	expandFilter() {
		this.setState({ expanded: !this.state.expanded });
	}

	updateScrollPosition() {
		const atTop = window.scrollY < 190;
		if (atTop !== this.state.atTop) {
			this.setState({ atTop });
		}
	}

	render() {
		const { books, total, authors, infoLoaded, selectedOption, narrow, expanded, atTop } = this.state;
		console.log(this.state);
		if (total !== '') {
			return (
				<div className="mainContent" id="resultContent">
					{/* render an expand button if no authr has been provoded and the screen is narrow */}
					{!this.props.match.params.author && narrow ? (
						<div
							style={{
								position: atTop && !expanded ? 'absolute' : 'fixed'
							}}
							id="expandFilter"
							className={`${expanded ? 'expandBottom' : atTop ? 'expandTop' : 'expandFixed'}`}
							onClick={this.expandFilter}
						>
							<img src={`/${expanded ? 'collapse' : 'expand'}.png`} />
							{expanded ? 'CLOSE' : 'FILTER'}
							<img src={`/${expanded ? 'collapse' : 'expand'}.png`} />
						</div>
					) : (
						''
					)}
					{/* render the filter side panel if no author has already been provided AND the screen either isn't too narrow or has been expanded  */}
					{!this.props.match.params.author && (!narrow || expanded) ? (
						<div
							id="sideBar"
							// Make the sidebar sticky if the user has scrolled a certain distance
							style={{
								position: atTop ? (!narrow ? 'relative' : 'absolute') : 'fixed',
								top: atTop ? 0 : '39px',
								width: !narrow ? '250px' : '100%'
							}}
						>
							<h4 className="sidebarHeading">Filter by Author</h4>
							{infoLoaded ? (
								// a select input that autocompletes based on the author list queried above
								<Select
									className="selectAuthor"
									value={selectedOption}
									placeholder="Search for author, or select below..."
									onChange={this.handleChange}
									options={authors}
								/>
							) : null}
							{/* full scrollable list of all authors who have written works that match the query */}
							<div className="sidebarSelectBox">
								{infoLoaded ? (
									[ ...authors ].map((author, key) => {
										return (
											<Link
												key={key}
												to={`/results/${this.props.match.params.search}/1/${author.label}`}
											>
												{author.label}
											</Link>
										);
									})
								) : (
									<Fragment>
										{/* loading image while the author info is being fetched and the state is being updated */}
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
										<span className="timeWarning">
											Gathering all authors... this could take a minute.
										</span>
									</Fragment>
								)}
							</div>
						</div>
					) : (
						''
					)}
					<div
						id="results"
						// add a margin if the sidebar becomes sticky, otherwise they will overlap
						style={{
							marginLeft: atTop || this.props.match.params.author || narrow ? '0' : '250px'
						}}
					>
						<div
							// info on the current search parameters (title, author) as well as how many results there are and what page you're on
							id="searchBriefing"
							style={{ padding: narrow && !this.props.match.params.author ? '45px 0 5px' : '15px 0 5px' }}
						>
							<span id="briefingParams">
								{this.props.match.params.author ? (
									`Title:  ${this.props.match.params.search}  -  Author:  ${this.props.match.params
										.author}`
								) : (
									`Search:  ${this.props.match.params.search}`
								)}
							</span>
							<br />
							<span id="briefingInfo">{`Results ${(this.props.match.params.page - 1) * 15 + 1} - ${this
								.props.match.params.page *
								15 >
							total
								? total
								: this.props.match.params.page * 15} of ${total}`}</span>
							{/* prev and next buttons */}
							{this.props.match.params.page > 1 ? (
								<Link
									className="pnButtonTop previousTop"
									to={`/results/${this.props.match.params.search}/${this.props.match.params.page * 1 -
										1}${this.props.match.params.author
										? `/${this.props.match.params.author}`
										: ''}`}
								>
									Previous Page
								</Link>
							) : (
								''
							)}
							{this.props.match.params.page * 15 < total ? (
								<Link
									className="pnButtonTop nextTop"
									to={`/results/${this.props.match.params.search}/${this.props.match.params.page * 1 +
										1}${this.props.match.params.author
										? `/${this.props.match.params.author}`
										: ''}`}
								>
									Next Page
								</Link>
							) : (
								''
							)}
						</div>
						{books.map((book, key) => {
							return <ResultLine key={key} book={book} />;
            })}
            <Pagination total={total} page={this.props.match.params.page} search={this.props.match.params.search} author={this.props.match.params.author} />
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
