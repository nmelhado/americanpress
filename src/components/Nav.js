import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      atTop: true
    }
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    document.addEventListener('scroll', () => {
      const atTop = window.scrollY < 180;
      if (atTop !== this.state.atTop) {
          this.setState({ atTop })
      }
    });
  }

	handleChange(e) {
		this.setState({
			input: e.target.value
		});
	}

	handleSearch() {
    console.log('Clicked!')
		this.props.setIngredients(this.state.ingredients, this.props.history);
	}

  render() {
    const { history } = this.props;
		const { handleSearch, handleChange } = this;
		const { input } = this.state;
    return (
      <Fragment>
        <img id="banner" src="banner.png" />
        <div id="navBar" style={{ position: this.state.atTop ? 'relative' : 'fixed', top: 0 }}>
          <div id="navLinks">
            <Link to="/"><img src="smallLogo.png" id="navLogo" />Home</Link>
            <Link to="/subjects">Browse by Subject</Link>
            <Link to="/dummy1">Dummy 1</Link>
            <Link to="/dummy2">Dummy 2</Link>
          </div>
          <form onSubmit={handleSearch} id="navSearch">
            <input placeholder="Search for a book..." onChange={handleChange} value={input} />
            <button><img src="search.png" /></button>
          </form>
        </div>
      </Fragment>
    )
  }
};

// const mapDispatchToProps = dispatch => ({
//   addToCart: (product, qty, history) => dispatch(addToCart(product, qty, history)),
// })

// export default connect(null, mapDispatchToProps)(Home);
export default Nav;
