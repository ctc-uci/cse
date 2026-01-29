import { Badge, Flex, IconButton, Text } from "@chakra-ui/react";

import { IoCloseSharp } from "react-icons/io5";

export const TagSelector = ({
  tags = {},
  selectedTags = [],
  onTagToggle,
  scrollable = false,
  reverseMapping = false,
}) => {
  // Format tag name for display
  const formatTagName = (name) => {
    if (typeof name !== "string") return String(name);
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Check if a tag is selected
  const isTagSelected = (tagId) => {
    if (reverseMapping) {
      // For FormModal: selectedTags is array of IDs, tagId is the actual ID from tags[name]
      if (Array.isArray(selectedTags)) {
        return selectedTags.includes(tagId);
      }
    } else {
      // For SearchBar: selectedTags is object with { [id]: boolean }
      if (typeof selectedTags === "object" && !Array.isArray(selectedTags)) {
        return selectedTags[tagId] === true;
      }
    }
    return false;
  };

  const containerProps = scrollable
    ? {
        gap: 3,
        maxWidth: "100%",
        overflowX: "auto",
        css: {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          MsOverflowStyle: "none",
          scrollbarWidth: "none",
        },
      }
    : {
        gap: 3,
        flexWrap: "wrap",
        width: "100%",
      };

  return (
    <Flex {...containerProps}>
      {Object.entries(tags).map(([key, value]) => {
        // For reverseMapping: key is tagName, value is tagId
        // For normal: key is tagId, value is tagName
        const tagId = reverseMapping ? value : key;
        const tagName = reverseMapping ? key : value;
        const displayName = formatTagName(tagName);
        const isSelected = isTagSelected(tagId);

        return (
          <Badge
            key={key}
            onClick={() => onTagToggle(reverseMapping ? tagName : tagId)}
            rounded="full"
            border={isSelected ? "none" : "1px solid"}
            borderColor="gray.300"
            color={isSelected ? "purple.800" : "gray.600"}
            bg={isSelected ? "purple.100" : "white"}
            textTransform="none"
            cursor="pointer"
            position="relative"
            display="inline-flex"
            alignItems="center"
            h="28px"
            transition="all 0.2s ease-in-out"
          >
            <Text
              px={2}
              pr={isSelected ? 5 : 2}
              fontWeight={isSelected ? 500 : 400}
              lineHeight="1"
              transition="font-weight 0.2s ease-in-out, padding-right 0.2s ease-in-out"
            >
              {displayName}
            </Text>
            {isSelected && (
              <IconButton
                bg="transparent"
                aria-label="Close"
                icon={
                  <IoCloseSharp
                    color="purple.800"
                    opacity={0.5}
                  />
                }
                variant="unstyled"
                position="absolute"
                right="4px"
                top="50%"
                transform="translateY(-50%)"
                w="16px"
                h="16px"
                minW="16px"
                p={0}
                m={0}
                transition="opacity 0.2s ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagToggle(reverseMapping ? tagName : tagId);
                }}
              />
            )}
          </Badge>
        );
      })}
    </Flex>
  );
};
