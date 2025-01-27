// /store/statemodel/resetPasswordStateReducer.js

export const resetPasswordOtpInitialState = {
    loading: false,
    success: false,
    error: null,
  };
  
  export const resetPasswordOtpStateReducer = (state, action) => {
    switch (action.type) {
      case 'RESET_PASSWORDOtp_REQUEST':
        return { ...state, loading: true, success: false, error: null };
      case 'RESET_PASSWORDOtp_SUCCESS':
        return { ...state, loading: false, success: true, error: null };
      case 'RESET_PASSWORDOtp_FAILURE':
        return { ...state, loading: false, success: false, error: action.payload };
      default:
        return state;
    }
  };
  