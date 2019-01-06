import React from 'react';
import { Link } from 'react-router-dom';

export default ({ book }) => {
  return (
    <div className="resultLine">
      <div className="previewContainer">
        {book.edition_key ? <Link to={`/book/${book.cover_edition_key ? book.cover_edition_key : book.edition_key[0]}`}><img className="previewImage" src={book.cover_edition_key ? `http://covers.openlibrary.org/b/OLID/${book.cover_edition_key}-M.jpg` : '/nia.jpg' } /></Link> : <img className="previewImage" src={book.cover_edition_key ? `http://covers.openlibrary.org/b/OLID/${book.cover_edition_key}-M.jpg` : '/nia.jpg' } />}
      </div>
      <span className="previewTitle">{book.edition_key ? <Link to={`/book/${book.cover_edition_key ? book.cover_edition_key : book.edition_key[0]}`}>{book.title}</Link> : book.title}</span>
      {book.publish_date ? <span className="previewDate">{book.publish_date[0]}</span> : ''}
      {book.author_name ? 
      <span className="previewAuthor">Author{book.author_name.length > 1 ? 's' : ''}: {book.author_name.map((author, key) => <span key={key} className="authorNames">{key > 0 ? `${key === (book.author_name.length -1) ? ' and ' : ', '}` : '' }<Link to={`/results/${book.author_key[key]}/1`}>{author}</Link></span>)}</span>
      : '' }
      {book.subject ? 
      <span className="previewSubjects">Subject{book.subject.length > 1 ? 's' : ''}: {book.subject.slice(0, 10).map((subject, key) => <span key={key} className="subjectNames">{key > 0 ? ', ' : '' }<Link to={`/subject/${subject}/1`}>{subject}</Link></span>)}</span>
      : '' }
      {book.id_amazon ? 
      <a className="previewAmazon" href={`https://www.amazon.com/dp/${book.id_amazon[0]}`} target="_blank">AMAZON</a>
      : '' }
    </div>
  )
}
