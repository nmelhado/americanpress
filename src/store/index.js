import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';

import {authReducer} from './auth';

const reducer = combineReducers({
  auth: authReducer,
});

export default createStore(reducer, applyMiddleware(logger, thunk));
