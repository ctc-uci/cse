import { useEffect, useRef, useState } from "react";

import {
  Badge,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";

import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ onSearch, tags = {}, tagFilter = {}, onTag }) => {
  const [searchInput, setSearchInput] = useState("");
  const debounceTimeoutRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 200ms debounce
    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(searchInput);
    }, 200);

    // Cleanup function to clear timeout on component unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput, onSearch]);

  const handleEnterKeyDown = async (e) => {
    if (e.key === "Enter") {
      // Clear debounce timeout and search immediately
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      onSearch(searchInput);
    }
  };

  return (
    <VStack
      spacing={4}
      align="stretch"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          variant="filled"
          borderRadius="lg"
          borderColor={"gray.300"}
          bg="white.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "gray.300" }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleEnterKeyDown}
        />
      </InputGroup>

      {tags && onTag && (
        <Flex
          gap={3}
          maxWidth="100%"
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            MsOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {Object.entries(tags).map(([id, name]) => (
            <Badge
              key={id}
              onClick={() => {
                onTag(id)();
              }}
              rounded="full"
              px={4}
              py={1}
              border={"1px"}
              borderColor="gray.300"
              colorScheme={tagFilter[id] ? "gray" : "white"}
              textTransform="none"
              cursor="pointer"
            >
              {name}
            </Badge>
          ))}
        </Flex>
      )}
    </VStack>
  );
};
