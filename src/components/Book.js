import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Book extends Component {
	constructor() {
		super();
		this.state = {
      title: '',
      description: '',
      authors: [],
      subjects: [],
      format: '',
      published: '',
      pages: 0,
      amazon: '',
      cover: ''
		};
	}

	componentDidMount() {
    return axios
      .get(
        `https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=details`
      )
      .then( res => res.data[this.props.match.params.id].details)
      .then( work => {const book = {title: work.title}; book['cover'] = work.covers ? `https://covers.openlibrary.org/b/OLID/${this.props.match.params.id}-L.jpg` : '/nia.jpg'; if(work.identifiers && work.identifiers['amazon.co.uk_asin']){book['amazon'] = work.identifiers['amazon.co.uk_asin'][0]}; if(work.identifiers && work.identifiers['goodreads']){book['goodreads'] = work.identifiers['goodreads'][0]}; if(work.physical_format){book['format'] = work.physical_format}; if(work.publish_date){book['published'] = work.publish_date}; if(work.authors){book['authors'] = work.authors}; if(work.number_of_pages){book['pages'] = work.number_of_pages}; if(work.subjects){book['subjects'] = work.subjects}; if(work.description){book['description'] = work.description} else {book['description'] = 'No description available.'}; return book})
      .then(book => this.setState({...book}))
      .then(() => {if(this.state.authors.length === 0){return axios.get(`https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=data`)}})
      .then(res => this.state.authors.length === 0 ? res.data[this.props.match.params.id] : null)
      .then( book => this.state.authors.length === 0 ? book.authors ? book.authors : ['No author provided.'] : null)
      .then( authors => this.state.authors.length === 0 ? this.setState({ authors }) : null)
      .catch((error) => console.log(error));
  }
  
  componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
      return axios
      .get(
        `https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=details`
      )
      .then( res => res.data[this.props.match.params.id].details)
      .then( work => {const book = {title: work.title}; book['cover'] = work.covers ? `https://covers.openlibrary.org/b/OLID/${this.props.match.params.id}-L.jpg` : '/nia.jpg'; if(work.identifiers['amazon.co.uk_asin']){book['amazon'] = work.identifiers['amazon.co.uk_asin'][0]}; if(work.identifiers['goodreads']){book['goodreads'] = work.identifiers['goodreads'][0]}; if(work.physical_format){book['format'] = work.physical_format}; if(work.publish_date){book['published'] = work.publish_date}; if(work.authors){book['authors'] = work.authors}; if(work.number_of_pages){book['pages'] = work.number_of_pages}; if(work.subjects){book['subjects'] = work.subjects}; if(work.description){book['description'] = work.description} else {book['description'] = 'No description available.'}; return book})
      .then(book => this.setState({...book}))
      .then(() => {if(this.state.authors.length === 0){return axios.get(`https://openlibrary.org/api/books?bibkeys=${this.props.match.params.id}&format=json&jscmd=data`)}})
      .then(res => this.state.authors.length === 0 ? res.data[this.props.match.params.id] : null)
      .then( book => this.state.authors.length === 0 ? book.authors ? book.authors : ['No author provided.'] : null)
      .then( authors => this.state.authors.length === 0 ? this.setState({ authors }) : null)
      .catch((error) => console.log(error));
    }
  }

	render() {
    const { title, authors, description, format, pages, published, subjects, amazon, goodreads, cover } = this.state;
    console.log(this.state)
    return (
      <div className="mainContent" id="bookContent">
        <div id="innerContent">
          <div id="bookDisplay">
            <img id="bookTransformer" src={`/bookBack${format.toLowerCase() === 'hardcover' ? 'Hardcover' : 'Paperback'}.png`} />
            <img id="bookCover" src={cover} />
          </div>
          <h2 className="bookTitle">{title}</h2>
          <span className="bookDate">{published}</span>
          {authors.length > 0 ? 
          <span className="bookAuthor">Author{authors.length > 1 ? 's' : ''}: {authors.map((author, key) => <span key={key} className="authorNames">{key > 0 ? `${key === (authors.length -1) ? ' and ' : ', '}` : '' }<Link to={`/results/${author.url ? author.url.split('org/')[1].split('/')[0] : author.key.split('authors/')[1]}/1`}>{author.name}</Link></span>)}</span>
          : '' }
          {subjects.length > 0 ? 
          <span className="bookSubjects">Subject{subjects.length > 1 ? 's' : ''}: {subjects.map((subject, key) => <span key={key} className="subjectNames">{key > 0 ? ', ' : '' }<Link to={`/subject/${subject}/1`}>{subject}</Link></span>)}</span>
          : '' }
          {description !== '' ? 
          <span className="bookDescription">{description.value ? description.value : description}</span>
          : '' }
        </div>
      </div>
    );
	}
}

export default Book;
