// /store/statemodel/resetPasswordStateReducer.js

export const resetPasswordInitialState = {
    loading: false,
    success: false,
    error: null,
    message: null, // To store success message
  };
  
  export const resetPasswordStateReducer = (state, action) => {
    switch (action.type) {
      case 'RESET_PASSWORD_REQUEST':
        return { ...state, loading: true, success: false, error: null, message: null };
        
      case 'RESET_PASSWORD_SUCCESS':
        return { 
          ...state, 
          loading: false, 
          success: true, 
          error: null, 
          message: action.payload.message // Success message returned from API
        };
        
      case 'RESET_PASSWORD_FAILURE':
        return { 
          ...state, 
          loading: false, 
          success: false, 
          error: action.payload.error, // Error message returned from API
          message: null 
        };
  
      default:
        return state;
    }
  };
  