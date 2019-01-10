import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import history from './history';
import Home from './components/Home';
import Nav from './components/Nav';
import Results from './components/Results';
import Book from './components/Book';
import Author from './components/Author';
import Title from './components/Title';

ReactDOM.render(
  <Router history={history}>
    <Fragment>
      <Route path="/" component={Nav} />
      <Route exact path="/" component={Home} />
      <Route path="/title" component={Title} />
      <Route path="/author" component={Author} />
      {/* If a user filters their results by author, the author id will be placed after the page number */}
      <Route path="/results/" component={Results} />
      {/* cover is sent in order to maintain a consistent look.  If the search results contained an image, the same image will be used in the details page.  Backup is another form of identifier, in case there are no results through the works search. */}
      <Route path="/book/:id/:cover?/:backup?" render={(props) => <Book {...props} />}/>
    </Fragment>
  </Router>,
	document.getElementById('app')
);
