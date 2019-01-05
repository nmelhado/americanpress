import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import ResultLine from './ResultLine';

class Results extends Component {
	constructor() {
		super();
		this.state = {
			books: [],
			total: 0,
			subjects: [],
			subject: '',
			authors: [],
			author: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		const state = { ...this.state };
		state[e.target.name] = e.target.value;
		this.setState(state);
	}

	componentDidMount() {
    let fullList;
    const link = `http://openlibrary.org/search.json?${this.props.match.params.author && (this.props.match.params.author !== '' && this.props.match.params.author !== null) ? `author=${this.props.match.params.author}&title`: 'q' }=${this.props.match.params.search}`
    return axios
      .get(
        `${link}&page=${this.props.match.params.page}&limit=15`
      )
      .then(res => this.setState({
        total: res.data.num_found,
        books: res.data.docs
      }))
      .then(() => axios.get(`${link}&limit=9000`))
      .then(res => res.data.docs)
      .then( books => {let info = {subject: new Set}; books.filter(book => book.subject).forEach( book => book.subject.forEach( (subject, ix) => {if(ix < 5){info['subject'].add(subject)}})); if(this.props.match.params.author && (this.props.match.params.author !== '' && this.props.match.params.author !== null)){}else{info['authors'] = new Set(books.filter(book => book.author_name).map( book => book.author_name[0])) }; return info;})
      .then( info => (this.props.match.params.author && (this.props.match.params.author !== '' && this.props.match.params.author !== null)) ? this.setState({subjects: info.subjects}) : this.setState({subjects: info.subjects, authors: info.authors}))
      .catch((error) => console.log(error));
  }
  
  componentDidUpdate(prevProps) {
		if (prevProps.match.params.search !== this.props.match.params.search || prevProps.match.params.search !== this.props.match.params.search) {
      return axios
        .get(
          `http://openlibrary.org/search.json?q=${this.props.match.params.search}&page=${this.props.match.params
            .page}&limit=15`
        )
        .then((res) => this.setState({
          total: res.data.num_found,
          books: res.data.docs
        }))
        .catch((error) => console.log(error));
    }
  }

	render() {
    const { books, total, authors } = this.state;
    console.log(authors)
		return (
			<div className="mainContent" id="resultContent">
        <div id="sideBar"></div>
        <div id="results">
          {books.map((book, key) => { return (<ResultLine key={key} book={book} />)})}
        </div>
			</div>
		);
	}
}

export default Results;
