import { Box, Text, VStack } from "@chakra-ui/react";

import QRCodeReact from "react-qr-code";

export const QRCode = ({ id, type, date }) => {
  const baseUrl = window.location.origin;
  const localDate = date || new Date().toISOString().split("T")[0]; // Default to today's date if no date is provided
  const qrUrl = `${baseUrl}/check-in/${type === "Class" ? "class" : "event"}/${id}${type === "Class" ? `/${encodeURIComponent(localDate)}` : ""}`;
  console.log("QR URL:", qrUrl);

  return (
    <VStack
      spacing={4}
      align="center"
      p={4}
    >
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        border="4px"
        borderColor="black" //
      >
        <QRCodeReact
          value={qrUrl}
          size={256}
          level="H"
        />
      </Box>
    </VStack>
  );
};
