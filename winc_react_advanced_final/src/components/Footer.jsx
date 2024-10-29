import { Box, Text } from "@chakra-ui/react";

export const Footer = () => (
  <Box as="footer" backgroundColor="gray.700" py={4}>
    <Text
      textAlign="center"
      fontWeight="semibold"
      fontSize="lg"
      color="gray.200"
    >
      Moments that Matter, Memories that Last.
    </Text>
  </Box>
);
