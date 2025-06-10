import {
  Box,
  Card,
  CardBody,
  Flex,
  Image,
  Link,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

export const NewsCard = ({
  id,
  S3Url,
  description,
  mediaUrl,
  tags,
  firstName,
  lastName,
}) => {
  return (
    <Box
      w="100%"
      borderColor={"gray.300"}
      borderWidth={1}
      borderRadius="lg"
    >
      <Card bg="gray.50">
        <CardBody>
          <Stack gap={2}>
            <Text
              fontSize="md"
              wordBreak={"break-word"}
            >
              {description ?? "No description"}
            </Text>
            <Text fontSize="sm">
              Posted by{" "}
              {firstName && lastName
                ? `${firstName} ${lastName}`
                : "Unknown Instructor"}
            </Text>
            <Link
              href={mediaUrl}
              isExternal
            >
              <Image
                src={S3Url}
                alt={`image for video article ${id}`}
              />
            </Link>

            <Flex
              mt={1}
              gap={1}
              wrap="nowrap"
            >
              {tags?.length > 0 &&
                tags.map((tag, index) => (
                  <Tag
                    key={index}
                    borderRadius="full"
                    textColor={"gray.600"}
                    borderColor={"gray.300"}
                    borderWidth={1}
                  >
                    {tag}
                  </Tag>
                ))}
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
