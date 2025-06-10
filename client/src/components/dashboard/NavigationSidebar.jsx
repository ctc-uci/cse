import {
  Box,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { MdHome, MdInfo, MdSettings } from "react-icons/md";
import { Link as RouterLink, useLocation } from "react-router-dom";

export const NavigationSidebar = () => {
  const location = useLocation();
  const activeBg = useColorModeValue("teal.100", "teal.700");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const routes = [
    { path: "/", name: "Home", icon: MdHome },
    { path: "/settings", name: "Settings", icon: MdSettings },
    { path: "/about", name: "About", icon: MdInfo },
  ];

  return (
    <Box
      w="250px"
      h="100vh"
      bg={useColorModeValue("white", "gray.800")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      p={4}
      position="sticky"
      top={0}
    >
      <Flex
        direction="column"
        gap={2}
      >
        {routes.map((route) => (
          <RouterLink
            to={route.path}
            key={route.path}
          >
            <Link
              as="div"
              display="flex"
              alignItems="center"
              p={3}
              borderRadius="md"
              bg={location.pathname === route.path ? activeBg : "transparent"}
              _hover={{
                bg: hoverBg,
                textDecoration: "none",
              }}
              transition="background-color 0.2s ease"
            >
              <Icon
                as={route.icon}
                mr={3}
                boxSize={5}
              />
              <Text fontSize="md">{route.name}</Text>
            </Link>
          </RouterLink>
        ))}
      </Flex>
    </Box>
  );
};
