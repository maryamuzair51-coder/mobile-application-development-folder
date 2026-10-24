
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import AuthModal from './authModal';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [afterLoginAction, setAfterLoginAction] = useState(null);

  const openAuthModal = useCallback(
  (callback) => {
    // If already logged in, perform the action without reopening login.
    if (currentUser) {
      if (typeof callback === 'function') {
        callback();
      }
      return;
    }

    setAfterLoginAction(() =>
      typeof callback === 'function' ? callback : null
    );
    setVisible(true);
  },
  [currentUser]
);
  const closeAuthModal = useCallback(() => {
    setVisible(false);
    setAfterLoginAction(null);
  }, []);

  const handleLogin = useCallback(
    (user, password) => {
      const email = user.email.trim().toLowerCase();

      const account = accounts.find(
        (item) => item.email === email
      );

      if (!account) {
        throw new Error(
          'Account not found. Please sign up first.'
        );
      }

      if (account.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      setCurrentUser({
        name: account.name,
        email: account.email,
      });
    },
    [accounts]
  );

  const handleSignup = useCallback(
    (user, password) => {
      const name = user.name.trim();
      const email = user.email.trim().toLowerCase();

      const exists = accounts.some(
        (account) => account.email === email
      );

      if (exists) {
        throw new Error(
          'An account with this email already exists. Please log in.'
        );
      }

      setAccounts((previous) => [
        ...previous,
        { name, email, password },
      ]);
    },
    [accounts]
  );

  // Called after the login success message has been displayed.
  
const handleLoginSuccess = useCallback(() => {
  const action = afterLoginAction;

  setAfterLoginAction(null);
  setVisible(false);

  if (typeof action === 'function') {
    // Resume the original action after the modal closes.
    setTimeout(() => {
      action();
    }, 250);
  }
}, [afterLoginAction]);


  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        openAuthModal,
        closeAuthModal,
        currentUser,
        isLoggedIn: !!currentUser,
        logout,
      }}
    >
      {children}

      <AuthModal
        visible={visible}
        onClose={closeAuthModal}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLoginSuccess={handleLoginSuccess}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error(
      'useAuthModal must be used inside AuthModalProvider.'
    );
  }

  return context;
}
