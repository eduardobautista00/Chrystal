import { authReducer, initialState as authInitialState } from './authReducer';

export const initialAuthState = authInitialState;

export const rootAuthReducer = ({ auth }, action) => (authReducer(auth, action));