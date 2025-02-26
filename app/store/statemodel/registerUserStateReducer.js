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
                error: null,
            };

        case 'REGISTER_SUCCESS':
            console.log('Registration Payload:', action.payload);
            // Handle both user and agent registration responses
            const responseData = action.payload || {};
            let userData = {};

            if (responseData.agent) {
                // Handle agent registration response
                userData = {
                    ...responseData.agent,
                    fullName: state.register_user?.fullName || 'N/A',
                    email: state.register_user?.email || 'N/A',
                };
            } else {
                // Handle user registration response
                const user = responseData.user || responseData || {};
                userData = {
                    ...user,
                    fullName: `${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`,
                    email: user.email || 'N/A',
                };
            }

            return {
                ...state,
                isLoading: false,
                isRegistered: true,
                register_user: userData,
                permissions: responseData.permissions || [],
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
                error: action.error,
            };
  
        default:
            return state;
    }
  };
  