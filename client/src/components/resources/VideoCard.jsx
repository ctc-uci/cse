import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

export const VideoCard = ({
  id,
  title,
  description,
  S3Url,
  classId,
  classTitle,
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
      <Card bg={"gray.50"}>
        <CardBody>
          <Stack gap={2}>
            <Heading
              size="md"
              wordBreak={"break-word"}
            >
              {title}
            </Heading>
            <Text
              fontSize="md"
              wordBreak={"break-word"}
            >
              {description ?? "No description"}
            </Text>
            <Text
              fontSize="sm"
              wordBreak={"break-word"}
            >
              Posted by{" "}
              {firstName && lastName
                ? `${firstName} ${lastName}`
                : "Unknown Instructor"}{" "}
              for Class: {classTitle}
            </Text>{" "}
            {/* Implement Instructor Name at later task! - josh :D */}
            <Link
              href={mediaUrl}
              isExternal
            >
              <Image
                src={S3Url}
                alt={`image for video ${title}`}
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
