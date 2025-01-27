// Initial state for the properties
export const propertyInitialState = {
    properties: [], // Array to store property objects
    loading: false, // Indicates if an API request is in progress
    error: null, // Stores any error message from the API
  };
  
  // Property reducer to manage property states
  export const propertyStateReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_PROPERTY_REQUEST':
        return {
          ...state,
          loading: true,
          error: null, // Clear any previous errors
        };
  
      case 'ADD_PROPERTY_SUCCESS':
        return {
          ...state,
          loading: false,
          properties: [
            ...state.properties,
            {
              id: action.payload.id, // Use the id from the API response
              title: action.payload.title,
              address: action.payload.address,
              price: action.payload.price,
              // Add any other fields returned by the API
              ...action.payload,
            },
          ],
        };
  
      case 'ADD_PROPERTY_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload, // Store the error message
        };
  
      case 'REMOVE_PROPERTY':
        return {
          ...state,
          properties: state.properties.filter(
            (property) => property.id !== action.payload.id // Remove property by id
          ),
        };
  
      default:
        return state;
    }
  };
  