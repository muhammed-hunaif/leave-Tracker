import { createContext, useReducer } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));

      return { user: action.payload };

    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null };

    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider; // ✅ THIS LINE IS IMPORTANT
