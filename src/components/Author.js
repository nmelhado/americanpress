import React, { Component } from 'react';

class Author extends Component {
	constructor() {
		super();
		this.state = {
			input: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleChange(e) {
		this.setState({
			input: e.target.value
		});
	}

	handleSearch(e) {
		e.preventDefault();
		// input is treated as q (a general search query), not a title or autor specific search
		// the 1 in the url below starts the user in page 1 of results
		this.props.history.push(`/results/?author=${this.state.input}&page=1`);
	}

	render() {
		const { handleSearch, handleChange } = this;
		const { input } = this.state;
		return (
			<div className="mainContent" id="homeContent">
				<h1>
					Search for an author<br />to begin your literary adventure!
				</h1>
				<form onSubmit={handleSearch} id="homeSearchForm">
					<input
						placeholder="Search for books by author..."
						onChange={handleChange}
						value={input}
						autoFocus
					/>
					<br />
					<button className="searchButton">
						<img src="/search.png" />Search
					</button>
				</form>
				{/* spacer balances the display so that the search input is more centered within the flexbox */}
				<div className="spacer" />
			</div>
		);
	}
}

export default Author;
