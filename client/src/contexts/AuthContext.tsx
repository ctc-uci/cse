import { createContext, ReactNode, useEffect, useState } from "react";

import { CreateToastFnReturn, Spinner } from "@chakra-ui/react";

import { AxiosInstance } from "axios";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

interface AuthContextProps {
  currentUser: User | null;
  role: string | null;
  teacherSignup: ({
    firstName,
    lastName,
    experience,
    email,
    password,
  }: TeacherSignup) => Promise<UserCredential>;
  studentSignup: ({
    firstName,
    lastName,
    level,
    email,
    password,
  }: SignUp) => Promise<UserCredential>;
  login: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: ({ email }: Pick<EmailPassword, "email">) => Promise<void>;
  handleRedirectResult: (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
  ) => Promise<void>;
  updateDisplayName: (user: UserCredential, fullName: string) => Promise<void>;
  updateRole: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface SignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

interface EmailPassword {
  email: string;
  password: string;
}

interface TeacherSignup {
  firstName: string;
  lastName: string;
  experience: string;
  email: string;
  password: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const studentSignup = async ({
    firstName,
    lastName,
    email,
    password,
    level,
  }: SignUp) => {
    if (currentUser) {
      signOut(auth);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await backend.post("/students", {
      firebaseUid: userCredential.user.uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: "user",
      userRole: "student",
      level: level,
    });

    return userCredential;
  };

  const teacherSignup = async ({
    firstName,
    lastName,
    experience,
    email,
    password,
  }: TeacherSignup) => {
    if (currentUser) {
      signOut(auth);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await backend.post("/teachers", {
      firstName: firstName,
      lastName: lastName,
      experience: experience,
      email: email,
      firebaseUid: userCredential.user.uid,
    });

    return userCredential;
  };

  const login = ({ email, password }: EmailPassword) => {
    if (currentUser) {
      signOut(auth);
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = ({ email }: Pick<EmailPassword, "email">) => {
    return sendPasswordResetEmail(auth, email);
  };

  /**
   * Helper function which keeps our DB and our Firebase in sync.
   * If a user exists in Firebase, but does not exist in our DB, we create a new user.
   *
   * **If creating a DB user fails, we rollback by deleting the Firebase user.**
   */
  const handleRedirectResult = async (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
  ) => {
    try {
      const result = await getRedirectResult(auth);

      if (result) {
        const response = await backend.get(`/users/${result.user.uid}`);
        if (response.data.length === 0) {
          try {
            await backend.post("/users/create", {
              email: result.user.email,
              firebaseUid: result.user.uid,
            });
          } catch (e) {
            await backend.delete(`/users/${result.user.uid}`);
            toast({
              position: "top",
              title: "An error occurred",
              description: `Account was not created: ${e.message}`,
              status: "error",
            });
          }
        }
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Redirect result error:", error);
    }
  };

  const updateDisplayName = async (
    userCredential: UserCredential,
    fullName: string
  ) => {
    if (userCredential?.user) {
      try {
        await updateProfile(userCredential.user, { displayName: fullName });
      } catch (error) {
        console.error("error", error);
      }
    } else {
      console.error("No user is signed in.");
    }
  };

  const updateRole = async () => {
    if (currentUser) {
      try {
        const response = await backend.get(`/users/${currentUser.uid}`);

        if (response.data && response.data[0].userRole) {
          setRole(response.data[0].userRole);
        } else {
          console.warn("User role not found in API response");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      updateRole();
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        role,
        currentUser,
        studentSignup,
        teacherSignup,
        login,
        logout,
        resetPassword,
        handleRedirectResult,
        updateDisplayName,
        updateRole,
      }}
    >
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
