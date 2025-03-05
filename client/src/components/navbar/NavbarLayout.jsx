import React from 'react'
import { Box } from "@chakra-ui/react"
import { Navbar } from './Navbar'

export const NavBarLayout = ({ children }) => {

  const NAVBAR_HEIGHT = "80px";

  return (
    <Box pb={NAVBAR_HEIGHT}>
        {children}
    </Box>
  )
}
