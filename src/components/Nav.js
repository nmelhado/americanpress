import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			// atTop will be used to make the navbar sticky if the user scrolls down far enough(far enough to place the navbar at the top of the page)
			atTop: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		// make navbar sticky if user scrolls more than 190px down
		document.addEventListener('scroll', () => {
			const atTop = window.scrollY < 190;
			if (atTop !== this.state.atTop) {
				this.setState({ atTop });
			}
		});
	}

	handleChange(e) {
		this.setState({
			input: e.target.value
		});
	}

	handleSearch(e) {
		e.preventDefault();
		e.target.blur();
		const { input } = this.state;
		this.setState({
			input: ''
		});
		// input is treated as q (a general search query), not a title or autor specific search
		// the 1 in the url below starts the user in page 1 of results
		this.props.history.push(`/results/${input}/1`);
	}

	render() {
		const { handleSearch, handleChange } = this;
		const { input } = this.state;
		return (
			<Fragment>
				{/* Add margin to the bottom of the banner to accomodate the navbar becoming fixed and no longer bumping content down */}
				<Link to="/">
					<img
						id="banner"
						src="/banner.png"
						style={{ margin: this.state.atTop ? '40px auto 30px' : '40px auto 69px' }}
					/>
				</Link>
				{/* navbar becomes sticky */}
				<div id="navBar" style={{ position: this.state.atTop ? 'relative' : 'fixed', top: 0 }}>
					<div id="navLinks">
						<Link to="/">
							<img src="/smallLogo_white.png" id="navLogo" />Home
						</Link>
						<Link to="/subjects">Browse by Subject</Link>
						<Link to="/dummy1">Dummy 1</Link>
						<Link to="/dummy2">Dummy 2</Link>
					</div>
					<form onSubmit={handleSearch} id="navSearch">
						<input placeholder="Search for a book..." onChange={handleChange} value={input} />
						<button>
							<img src="/search_blue.png" />
						</button>
					</form>
				</div>
			</Fragment>
		);
	}
}

export default Nav;
