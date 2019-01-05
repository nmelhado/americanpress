import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
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
      <div className="mainContent" id="homeContent">
        <h1>Explore our library of books<br />to begin your literary adventure!</h1>
        <form onSubmit={handleSearch} id="homeSearchForm">
          <input placeholder="Search for a book by title or author..." onChange={handleChange} value={input} autoFocus />
          <br />
          <button className="searchButton"><img src="search.png" />Search</button>
        </form>
        <div className="spacer"></div>
      </div>
    )
  }
};

// const mapDispatchToProps = dispatch => ({
//   addToCart: (product, qty, history) => dispatch(addToCart(product, qty, history)),
// })

// export default connect(null, mapDispatchToProps)(Home);
export default Home;
