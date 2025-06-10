import { useState } from "react";

import { Button } from "@chakra-ui/react";

import { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { logout } from "../../utils/auth/authUtils";

// import { clearCookies } from "../../utils/auth/cookie";

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = async () => {
    try {
      await logout("/landing", navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <Button
        type="submit"
        onClick={handleLogout}
        bg="purple.600"
        color="white"
        height="6.407vh"
        // width calculated from figma hi-fi
        w="82.33vw"
        mb={6}
      >
        Log out
      </Button>
    </div>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

const L = withCookies(Logout);
export { L };
