import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			// atTop will be used to make the navbar sticky if the user scrolls down far enough(far enough to place the navbar at the top of the page)
      atTop: true,
      expanded: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.expand = this.expand.bind(this);
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
  
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        expanded: false
      });
    }
  }

	handleChange(e) {
		this.setState({
			input: e.target.value
		});
	}

	expand() {
		this.setState({
			expanded: !this.state.expanded
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
		this.props.history.push(`/results/?search=${input}&page=1`);
	}

	render() {
		const { handleSearch, handleChange, expand } = this;
		const { input, expanded } = this.state;
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
            <img src="/menu.png" id="menuIcon" onClick={expand} />
            <div id="menuSpacer"></div>
						<Link to="/">
							<img src="/smallLogo_white.png" id="navLogo" />Home
						</Link>
						<Link to="/title">Search by Title</Link>
						<Link to="/author">Search by Author</Link>
						<Link to="/subjects">Browse by Subject</Link>
					</div>
					<form onSubmit={handleSearch} id="navSearch">
						<input placeholder="Search for a book..." onChange={handleChange} value={input} />
						<button>
							<img src="/search_blue.png" />
						</button>
					</form>
				</div>
        {/* Display the following if the sandwich menu has been expanded */}
        {expanded ?
        <Fragment>
          {/* closeMenu is a fixed div that is directy behind the men and ollapses the menu when someone clicks outside of the menu. */}
          <div id="closeMenu" onClick={expand} />
          <div id="expandedOptions" style={{ position: this.state.atTop ? 'absolute' : 'fixed', top: this.state.atTop ? '229px' : '39px' }}>
            <Link to="/">
              <img src="/smallLogo.png" id="navLogo" />Home
            </Link>
            <Link to="/title">Search by Title</Link>
            <Link to="/author">Search by Author</Link>
            <Link to="/subjects">Browse by Subject</Link>
          </div>
        </Fragment>
        : ''}
			</Fragment>
		);
	}
}

export default Nav;
