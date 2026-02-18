import { useEffect, useRef, useState } from "react";

import { Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";

import { FaSearch } from "react-icons/fa";

import { TagSelector } from "../shared/TagSelector";

export const SearchBar = ({ onSearch, tags = {}, tagFilter = {}, onTag }) => {
  const [searchInput, setSearchInput] = useState("");
  const debounceTimeoutRef = useRef(null);
  const isResources = location.pathname.includes("/resources");

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
      spacing={3}
      align="stretch"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" size={12} />
        </InputLeftElement>
        <Input
          placeholder={isResources ? "Search for Resources" : "Search for Classes"}
          variant="filled"
          fontSize="md"
          border="1px"
          borderRadius="xl"
          borderColor={"gray.200"}
          bg="white"
          _hover={{ bg: "gray.50" }}
          _focus={{ bg: "white", borderColor: "gray.300" }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleEnterKeyDown}
        />
      </InputGroup>

      {tags && onTag && (
        <TagSelector
          tags={tags}
          selectedTags={tagFilter}
          onTagToggle={(tagId) => {
            onTag(tagId)();
          }}
          scrollable={true}
          reverseMapping={false}
        />
      )}
    </VStack>
  );
};
