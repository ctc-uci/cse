import { signOut } from "firebase/auth";

import { clearCookies } from "./cookie";
import { auth } from "./firebase";

const logout = async (redirectPath, navigate, cookies) => {
  await signOut(auth);
  clearCookies(cookies);
  navigate(redirectPath);
  // window.location.reload();
  localStorage.clear();
  sessionStorage.clear();
};

export { logout };
