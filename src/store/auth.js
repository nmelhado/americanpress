const SET_AUTHENTICATED_USER = 'SET_AUTHENTICATED_USER';

const _setAuthenticatedUser = authenticatedUser => ({
  type: SET_AUTHENTICATED_USER,
  user: authenticatedUser
});

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED_USER:
      state = action.user;
      break;
    default:
      return state;
  }
};

export {
  authReducer,
};
