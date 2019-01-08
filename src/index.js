import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import history from './history';
import Home from './components/Home';
import Nav from './components/Nav';
import Results from './components/Results';
import Book from './components/Book';

ReactDOM.render(
  <Router history={history}>
    <Fragment>
      <Route path="/" component={Nav} />
      <Route exact path="/" component={Home} />
      {/* If a user filters their results by author, the author id will be placed after the page number */}
      <Route path="/results/:search/:page/:author?" render={(props) => <Results {...props} />}/>
      {/* cover is sent in order to maintain a consistent look.  If the search results contained an image, the same image will be used in the details page.  Backup is another form of identifier, in case there are no results through the works search. */}
      <Route path="/book/:id/:cover?/:backup?" render={(props) => <Book {...props} />}/>
    </Fragment>
  </Router>,
	document.getElementById('app')
);
