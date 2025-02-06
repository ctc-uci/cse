
import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { NewsCard } from "./NewsCard";
import { UploadComponent } from "./UploadComponent";
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useEffect, useState } from "react";

import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";

import CreateArticle from "../../components/forms/createArticle.tsx";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import CreateVideo from "../forms/createVideo.jsx";
import { NewsCard } from "./NewsCard";
import { VideoCard } from "./VideoCard";

export const Resources = () => {
  const [showForm, setShowForm] = useState(false);
  const { backend } = useBackendContext();


  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [resourceFilter, setResourceFilter] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");

  const [postArticle, setPostArticle] = useState(false);
  const [formType, setFormType] = useState(null);

  const handleVideoButton = () => {
    setResourceFilter(setResourceFilter ? "VIDEO" : null);
  };

  const handleNewsButton = () => {
    setResourceFilter(setResourceFilter ? "NEWS" : null);
  };

  const searchResouce = async () => {
    if (resourceFilter) {
      if (resourceFilter === "VIDEO") {
        try {
          const videoResponse = await backend.get(
            `/classes-videos/search/${filterTitle}`
          );
          setVideos(videoResponse.data);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      } else if (resourceFilter === "NEWS") {
        //does not work yet
        // try {
        //   const newsResponse = await backend.get(`/articles/search/${title}`);
        //   setNews(newsResponse.data);
        // } catch (error) {
        //   console.error("Error fetching news:", error);
      }
    }
  };

  const fetchVideos = async () => {
    try {
      const videoResponse = await backend.get("/classes-videos");
      setVideos(videoResponse.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await backend.get("/articles");
      setNews(newsResponse.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchVideos(); // Fetch videos initially
    fetchNews(); // Fetch news initially
  }, []);

  return (
    <Box>
    <Flex
      direction="column"
      p={4}
      gap={4}
      position={"relative"}
      justifyContent={"center"}
    >
      {postArticle ? (
        <Flex
          direction="column"
          justifyContent="center"
          gap={4}
          height={"100vh"}
        >
          {formType === null ? (
            <>
              <Button onClick={() => setFormType("VIDEO")}>Video</Button>
              <Button onClick={() => setFormType("ARTICLE")}>Article</Button>
            </>
          ) : (
            <>{formType === "VIDEO" ? <CreateVideo /> : <CreateArticle />}</>
          )}
        </Flex>
      ) : (
        <>
          <Text
            textStyle="xl"
            mb={4}
          >
            Resources
          </Text>

          <HStack spacing={0}>
            <Input
              placeholder="Type here"
              width="auto"
              borderRightRadius={0}
              onChange={(e) => setFilterTitle(e.target.value)}
            />
            <Button
              colorScheme="teal"
              borderLeftRadius={0}
              disabled={!filterTitle}
              onClick={searchResouce}
            >
              Search
            </Button>
          </HStack>
          <Flex gap={4}>
            <Button
              onClick={handleVideoButton}
              colorScheme={resourceFilter === "VIDEO" ? "purple" : "gray"}
            >
              Videos
            </Button>
            <Button
              onClick={handleNewsButton}
              colorScheme={resourceFilter === "NEWS" ? "purple" : "gray"}
            >
              News
            </Button>
          </Flex>
          <Box>
            <Text
              fontWeight="bold"
              mt={4}
            >
              Videos
            </Text>
            <Flex
              wrap="wrap"
              gap={4}
            >
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  description={video.description}
                  title={video.title}
                  S3Url={video.S3Url}
                  classId={video.classId}
                  mediaUrl={video.mediaUrl}
                />
              ))}
            </Flex>
          </Box>
          <Box>
            <Text
              fontWeight="bold"
              mt={4}
            >
              News
            </Text>
            <Flex
              wrap="wrap"
              gap={4}
            >
              {news.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  id={newsItem.id}
                  S3Url={newsItem.S3Url}
                  description={newsItem.description}
                  mediaUrl={newsItem.mediaUrl}
                />
              ))}
            </Flex>
          </Box>
        </>
      )}
      {/* // uncentered button */}
      <Button
        display="flex"
        onClick={() => {
          setPostArticle(!postArticle);
          setFormType(null);
        }}
        borderRadius="100%"
        padding="0"
        colorScheme={postArticle ? "gray" : "purple"} // Change color
        position="fixed"
        right={4}
        top={postArticle ? 4 : undefined} // Move to left if postArticle is true
        bottom={postArticle ? undefined : 4} // Move to left if postArticle is true
        fontSize="20px"
        backgroundColor={postArticle ? "gray.300" : "purple"} // Change background color
      >
        {postArticle ? <>&larr;</> : "+"}{" "}
        {/* Change the icon to < (left arrow) */}
      </Button>
    </Flex>
    <Navbar></Navbar>
    </Box>
  );
};
