import { createContext, useContext, useState, useEffect } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [error, setError] = useState(null);

  // Storing tokens

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      // console.log(savedToken);
      // Confirming that my token is saved
      setToken(savedToken);
      setLocation("TABLET");
    }
  }, []);

  // TODO: signup
  const signup = async (username) => {
    setError(null);
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.message || "Signup Failed. Please try again."
        );
      }
      // console.log(response);

      const result = await response.json();
      // console.log(result);
      setToken(result.token);
      setLocation("TABLET");
      sessionStorage.setItem("token", result.token);
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  // TODO: authenticate
  const authenticate = async () => {
    if (!token) {
      setError("User not found. Please signup");
      throw new Error("User not found. Please signup");
    }
    setError(null);
    try {
      const response = await fetch(`${API}/authenticate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      // console.log(result);
      if (result.success) {
        setLocation("TUNNEL");
      } else {
        throw new Error("Authentification failed");
      }
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  // Logout button that resets my game and clears the token
  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
    setLocation("GATE");
  };

  const value = { token, location, signup, authenticate, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
