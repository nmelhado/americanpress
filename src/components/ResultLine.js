import React from 'react';
import { Link } from 'react-router-dom';

export default ({ book }) => {
	return (
		<div className="resultLine">
			<div className="previewContainer">
				<Link
					to={`/book/${book.key.split('works/')[1]}${book.cover_i * 1 > -1
						? `/${book.cover_i}`
						: book.cover_id * 1 > -1 ? `/${book.cover_id}` : ''}${book.cover_edition_key
						? `/${book.cover_edition_key}`
						: ''}`}
				>
					<img
						className="previewImage"
						src={
							book.cover_i * 1 > -1 ? (
								`http://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`
							) : book.cover_id * 1 > -1 ? (
								`http://covers.openlibrary.org/b/ID/${book.cover_id}-M.jpg`
							) : (
								'/nia.jpg'
							)
						}
					/>
				</Link>
			</div>
			<span className="previewTitle">
				<Link
					to={`/book/${book.key.split('works/')[1]}${book.cover_i * 1 > -1
						? `/${book.cover_i}`
						: book.cover_id * 1 > -1 ? `/${book.cover_id}` : ''}${book.cover_edition_key
						? `/${book.cover_edition_key}`
						: ''}`}
				>
					{book.title}
				</Link>
			</span>
			{book.publish_date ? <span className="previewDate">{book.publish_date[0]}</span> : ''}
			{book.author_name ? (
				<span className="previewAuthor">
					Author{book.author_name.length > 1 ? 's' : ''}:{' '}
					{book.author_name.map((author, key) => (
						<span key={key} className="authorNames">
							{key > 0 ? `${key === book.author_name.length - 1 ? ' and ' : ', '}` : ''}
							<Link to={`/results/?author=${author}&page=1`}>{author}</Link>
						</span>
					))}
				</span>
			) : book.authors ? (
				<span className="previewAuthor">
					Author{book.authors.length > 1 ? 's' : ''}:{' '}
					{book.authors.map((author, key) => (
						<span key={key} className="authorNames">
							{key > 0 ? `${key === book.authors.length - 1 ? ' and ' : ', '}` : ''}
							<Link to={`/results/?author=${author.name}&page=1`}>{author.name}</Link>
						</span>
					))}
				</span>
			) : (
				''
			)}
			{book.subject ? (
				<span className="previewSubjects">
					Subject{book.subject.length > 1 ? 's' : ''}:{' '}
					{book.subject.slice(0, 10).map((subject, key) => (
						<span key={key} className="subjectNames">
							{key > 0 ? ', ' : ''}
							<Link to={`/results/?subject=${subject}&page=1`}>{subject}</Link>
						</span>
					))}
				</span>
			) : (
				''
			)}
		</div>
	);
};
