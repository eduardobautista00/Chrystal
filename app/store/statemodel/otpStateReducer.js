// Initial state for OTP verification
export const otpInitialState = {
  loading: false,
  success: false,
  error: null,
};

// Reducer for OTP verification
export const otpStateReducer = (state, action) => {
  switch (action.type) {
    case 'OTP_VERIFICATION_REQUEST':
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case 'OTP_VERIFICATION_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case 'OTP_VERIFICATION_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
