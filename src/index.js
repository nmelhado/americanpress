import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import history from './history';
import Home from './components/Home';
import Nav from './components/Nav';
import Results from './components/Results';
import Book from './components/Book';
import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
      <Fragment>
        <Route path="/" component={Nav} />
        <Route exact path="/" component={Home} />
        <Route path="/results/:search/:page/:author?" render={(props) => <Results {...props} />}/>
        <Route path="/book/:id/:cover?/:backup?" render={(props) => <Book {...props} />}/>
      </Fragment>
		</Router>
	</Provider>,
	document.getElementById('app')
);
