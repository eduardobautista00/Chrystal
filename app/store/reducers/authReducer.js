// Action Types
// export const REGISTER_REQUEST = 'REGISTER_REQUEST';
// export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
// export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const FAKE_LOGIN_SUCCESS = 'FAKE_LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const AGENT_REQUEST = 'AGENT_REQUEST';
export const AGENT_SUCCESS = 'AGENT_SUCCESS';
export const AGENT_FAILURE = 'AGENT_FAILURE';

const fake_user = {
  "first_name": "Admin",
  "last_name": "User",
  "username": "admin",
  "email": "admin@gmail.com",
  "roles": [
    {
      "role_name": "Admin",
      "permission": [
        "Generate Ticket",
        "Manage Users",
        "View Staff Logs",
        "View Branches",
        "View Users",
        "Manage Account",
        "View Ticket History"
      ]
    }
  ]
};


export const initialState = {
    isAuthenticated: false,
    user: null,
    rolePermission: null,
    role: null,
    isLoading: false,
    token: null,
    error: null,
  };
  


  export const authReducer = (state, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
      //case REGISTER_REQUEST:
      case AGENT_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoading: false,
          user: action.payload.user,
          isAuthenticated: true,
          rolePermission: action.payload.permission ,
          role: action.payload.user.role_name ,
          token : action.payload.token,
          error: null,
        };
      case FAKE_LOGIN_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isAuthenticated: true,
          user: fake_user,
          rolePermission: fake_user.roles[0].permission ,
          role: fake_user.roles[0].role_name ,
          token : "53QYuA9EYHcAyBOxw1zKXTGBzbRApy0wcQrdVuomOY8gYevr9bb7581mIJ8m5XgM",
          error: null
        };
        // case REGISTER_SUCCESS:
        

        //     return {
        //         ...state,
        //         loading: false,
        //         sample : "dafadf" ,
        //         register_user: {...action.payload.user , fullName : action.payload.user.first_name },
        //     };
      case LOGIN_FAILURE:
      //case REGISTER_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      case LOGOUT:
        return {
          ...initialState,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;