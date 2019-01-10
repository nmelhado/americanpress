import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import * as qs from 'query-string';

import ResultLine from './ResultLine';
import Pagination from './Pagination';
import { browseQuery, pullAuthorsQuery, browseSubject } from '../utils';

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
		this.props.history.push(
			`/results/?title=${qs.parse(this.props.location.search).search}&page=1&author=${selectedOption.value}`
		);
	}

	componentDidMount() {
		const { search, author, title, subject, page } = qs.parse(this.props.location.search);
		// make filter bar (and, on small screens, the expand button) sticky when scrolling further than 190px
		window.addEventListener('scroll', this.updateScrollPosition);
		// rearranges certain elements if the screen isn't wide enough to display thijngs comfortably
		window.addEventListener('resize', this.updateWindowDimensions);
		this.updateWindowDimensions();
		// treat the main search parameter as a general query, unless an author is provoded, in which case treat it as a tite search
		return (!subject ? browseQuery(author, search, title, page) : browseSubject(subject, page))
			.then((results) => this.setState({ ...results }))
			.then(() => {
				return !subject ? pullAuthorsQuery(author, search, title) : null;
			})
			.then(
				(results) =>
					results
						? author && author !== '' && author !== null
							? this.setState({ subjects: results.subjects })
							: this.setState({
									subjects: results.subjects,
									authors: results.authors,
									infoLoaded: true
								})
						: null
			)
			.catch((error) => console.log(error));
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
				expanded: false
			});
			const { search, author, title, subject, page } = qs.parse(this.props.location.search);
			return (!subject ? browseQuery(author, search, title, page) : browseSubject(subject, page))
				.then((results) => this.setState({ ...results }))
				.then(() => {
					return !subject ? pullAuthorsQuery(author, search, title) : null;
				})
				.then(
					(results) =>
						results
							? author && author !== '' && author !== null
								? this.setState({ subjects: results.subjects })
								: this.setState({
										subjects: results.subjects,
										authors: results.authors,
										infoLoaded: true
									})
							: null
				)
				.catch((error) => console.log(error));
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
					{!qs.parse(this.props.location.search).author &&
					narrow &&
					!qs.parse(this.props.location.search).subject ? (
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
					{!qs.parse(this.props.location.search).author &&
					(!narrow || expanded) &&
					!qs.parse(this.props.location.search).subject ? (
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
												to={`/results/?title=${qs.parse(this.props.location.search)
													.search}&page=1&author=${author.label}`}
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
							marginLeft:
								atTop ||
								qs.parse(this.props.location.search).author ||
								narrow ||
								qs.parse(this.props.location.search).subject
									? '0'
									: '250px'
						}}
					>
						<div
							// info on the current search parameters (title, author) as well as how many results there are and what page you're on
							id="searchBriefing"
							style={{
								padding:
									narrow &&
									!qs.parse(this.props.location.search).author &&
									!qs.parse(this.props.location.search).subject
										? '45px 0 5px'
										: '15px 0 5px'
							}}
						>
							<span id="briefingParams">
								{qs.parse(this.props.location.search).subject ? (
									`Subject:  ${qs.parse(this.props.location.search).subject}`
								) : (
									''
								)}
								{qs.parse(this.props.location.search).search ? (
									`Search:  ${qs.parse(this.props.location.search).search}`
								) : (
									''
								)}
								{qs.parse(this.props.location.search).title ? (
									`Title:  ${qs.parse(this.props.location.search).title}`
								) : (
									''
								)}
								{qs.parse(this.props.location.search).author ? (
									`${qs.parse(this.props.location.search).title ? '  -  ' : ''}Author:  ${qs.parse(
										this.props.location.search
									).author}`
								) : (
									''
								)}
							</span>
							<br />
							<span id="briefingInfo">{`Results ${(qs.parse(this.props.location.search).page - 1) * 15 +
								1} - ${this.props.match.params.page * 15 > total
								? total
								: qs.parse(this.props.location.search).page * 15} of ${total}`}</span>
							{/* prev and next buttons */}
							{qs.parse(this.props.location.search).page > 1 ? (
								<Link
									className="pnButtonTop previousTop"
									to={`/results/${qs.parse(this.props.location.search).search}/${qs.parse(
										this.props.location.search
									).page *
										1 -
										1}${qs.parse(this.props.location.search).author
										? `/${qs.parse(this.props.location.search).author}`
										: ''}`}
								>
									Previous Page
								</Link>
							) : (
								''
							)}
							{qs.parse(this.props.location.search).page * 15 < total ? (
								<Link
									className="pnButtonTop nextTop"
									to={`/results/${qs.parse(this.props.location.search).search}/${qs.parse(
										this.props.location.search
									).page *
										1 +
										1}${qs.parse(this.props.location.search).author
										? `/${qs.parse(this.props.location.search).author}`
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
						<Pagination
							total={total}
							page={qs.parse(this.props.location.search).page}
							subject={qs.parse(this.props.location.search).subject}
							subject={qs.parse(this.props.location.search).title}
							search={qs.parse(this.props.location.search).search}
							author={qs.parse(this.props.location.search).author}
						/>
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
