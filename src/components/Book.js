import React, { Component } from 'react';
import axios from 'axios';

class Book extends Component {
	constructor() {
		super();
		this.state = {
			books: {},
		};
	}

	componentDidMount() {
    return axios
      .get(
        `https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=details`
      )
      .then(res => this.setState({
        book: res.data[this.props.match.params.id]
      }))
      .catch((error) => console.log(error));
  }
  
  componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
      return axios
      .get(
        `https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=details`
      )
      .then(res => this.setState({
        book: res.data[this.props.match.params.id]
      }))
      .catch((error) => console.log(error));
    }
  }

	render() {
    const { book } = this.state;
    console.log(book)
		return (
			<div className="mainContent" id="bookContent">
			</div>
		);
	}
}

export default Book;
