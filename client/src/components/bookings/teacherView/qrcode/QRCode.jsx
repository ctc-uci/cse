import { Box, Text, VStack } from "@chakra-ui/react";

import QRCodeReact from "react-qr-code";

export const QRCode = ({ id, type, date}) => {
  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/check-in/${type === 'Class' ? 'class' : 'event'}/${id}${date ? `/${encodeURIComponent(date)}` : ''}`;
  // console.log(qrUrl);

  return (
    <VStack
      spacing={4}
      align="center"
      p={4}
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
      >
        {type} Check-in QR Code
      </Text>
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <QRCodeReact
          value={qrUrl}
          size={256}
          level="H"
        />
      </Box>
      <Text
        fontSize="sm"
        color="gray.600"
      >
        Scan this code to check in to the {type}
      </Text>
    </VStack>
  );
};
