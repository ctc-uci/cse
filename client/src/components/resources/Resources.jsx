
import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { NewsCard } from "./NewsCard";
import { UploadComponent } from "./UploadComponent";
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useEffect, useState } from "react";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";

import CreateArticle from "../../components/forms/createArticle.jsx";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import CreateVideo from "../forms/createVideo.jsx";
import { NewsCard } from "./NewsCard";
import { VideoCard } from "./VideoCard";

export const Resources = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { backend } = useBackendContext();


  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [resourceFilter, setResourceFilter] = useState(0);
  const [filterTitle, setFilterTitle] = useState(null);

  const [postArticle, setPostArticle] = useState(false);
  const [formType, setFormType] = useState(null);

  const searchResouce = async () => {
<<<<<<< HEAD
    if (resourceFilter === 0) {
      try {
        const videoResponse = await backend.get(
          `/classes-videos/search/${filterTitle}`
        );
        setVideos(videoResponse.data);
        setShowAlert(false);
      } catch (error) {
        setShowAlert(true);
      }
    } else if (resourceFilter === "NEWS") {
      //does not work yet
      try {
        const newsResponse = await backend.get(`/articles/search/${title}`);
        setNews(newsResponse.data);
      } catch (error) {
        console.error("Error fetching news:", error);
=======
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
          try {
            const newsResponse = await backend.get(`/articles/search/${filterTitle}`);
            setNews(newsResponse.data);
          } catch (error) {
            console.error("Error fetching news:", error);
        }
>>>>>>> b577d10 (finished articles, small placeholder problems.)
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
        >
          {formType === null ? (
            <Flex
              direction={"column"}
              align={"center"}
              gap={4}
            >
              <Button
                onClick={() => setFormType("VIDEO")}
                width={"10rem"}
              >
                Video
              </Button>
              <Button
                onClick={() => setFormType("ARTICLE")}
                width="10rem"
              >
                Article
              </Button>
            </Flex>
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
          <Tabs
            isFitted
            colorScheme="teal"
            variant="unstyled"
            onChange={(index) => setResourceFilter(index)}
          >
            <TabList>
              <Tab>Video</Tab>
              <Tab>News</Tab>
            </TabList>
            <TabIndicator
              height="2px"
              bg="teal"
              borderRadius="1px"
            />
          </Tabs>

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

          {showAlert ? (
            <Alert status="warning">
              <AlertIcon />
              Sorry, we could not find any resources
            </Alert>
          ) : (
            <>
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
