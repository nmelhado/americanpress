import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
	return (
		<div className="mainContent" id="subjectsContent">
				<h1 id="subjectHeader">
					Select a subject to find a book!
				</h1>
				<div id="subjectContainer">
          <Link to='/results/?subject=adventure&page=1' className="subjectButton">
            <img src="/genres/adventure.jpg" className="subjectIcon" />
            Adventure
          </Link>
          <Link to='/results/?subject=classics&page=1' className="subjectButton">
            <img src="/genres/classics.jpg" className="subjectIcon" />
            Classics
          </Link>
          <Link to='/results/?subject=comedy&page=1' className="subjectButton">
            <img src="/genres/comedy.jpg" className="subjectIcon" />
            Comedy
          </Link>
          <Link to='/results/?subject=fantasy&page=1' className="subjectButton">
            <img src="/genres/fantasy.jpg" className="subjectIcon" />
            Fantasy
          </Link>
          <Link to='/results/?subject=film&page=1' className="subjectButton">
            <img src="/genres/film.jpg" className="subjectIcon" />
            Film
          </Link>
          <Link to='/results/?subject=horror&page=1' className="subjectButton">
            <img src="/genres/horror.jpg" className="subjectIcon" />
            Horror
          </Link>
          <Link to='/results/?subject=mystery&page=1' className="subjectButton">
            <img src="/genres/mystery.jpg" className="subjectIcon" />
            Mystery
          </Link>
          <Link to='/results/?subject=poetry&page=1' className="subjectButton">
            <img src="/genres/poetry.jpg" className="subjectIcon" />
            Poetry
          </Link>
          <Link to='/results/?subject=romance&page=1' className="subjectButton">
            <img src="/genres/romance.jpg" className="subjectIcon" />
            Romance
          </Link>
          <Link to='/results/?subject=science_fiction&page=1' className="subjectButton">
            <img src="/genres/scifi.jpg" className="subjectIcon" />
            Sci-fi
          </Link>
          <Link to='/results/?subject=sports&page=1' className="subjectButton">
            <img src="/genres/sports.jpg" className="subjectIcon" />
            Sports
          </Link>
          <Link to='/results/?subject=thriller&page=1' className="subjectButton">
            <img src="/genres/thriller.jpg" className="subjectIcon" />
            Thriller
          </Link>
        </div>
			</div>
	);
};
