import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export const Root = () => (
  <Box
    backgroundColor="blue.700"
    minH="100vh"
    display="flex"
    flexDirection="column"
  >
    <Navigation />
    <Box flex="1" p={4}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);
