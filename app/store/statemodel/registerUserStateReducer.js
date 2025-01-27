// Initial state for the agent registration process
export const registerInitialState = {
    user: null,           // Store user details
    //token: null,          // Store the JWT token
    permissions: [],      // Store permissions for the agent (if applicable)
    isLoading: false,     // To track loading state
    error: null,          // To track any errors during registration
    isRegistered: false,  // Track whether registration was successful
};
  
export const registerStateReducer = (state, action) => {
    switch (action.type) {
        case 'REGISTER_REQUEST':
            return {
            ...state,
            isLoading: true,
            error: null, // Reset errors before new registration attempt
            };
  
            case 'REGISTER_SUCCESS':
                console.log('Registration Payload:', action.payload);  // Log the entire payload
                const user = action.payload || {};  // Ensure user is defined
                const fullName = `${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`;  // Safeguard against undefined
                const email = user.email;
                console.log('Full Name:', fullName);  // Log the full name
                console.log('email:', email + "test");
                return {
                    ...state,
                    isLoading: false,
                    isRegistered: true,
                    register_user: {
                        ...user,
                        fullName,
                        email,
                    },
                    permissions: action.payload.permissions || [],
                };
            
        case 'REGISTER_AGENT':
            // Add agent registration state management here
            return {
                ...state,
                agentInfo: action.payload,
            };
  
        case 'REGISTER_FAILURE':
            return {
            ...state,
            isLoading: false,
            error: action.error, // Store error message
            };
  
        default:
            return state;
    }
  };
  