import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Center,
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { SearchBar } from "../searchbar/SearchBar";
import { NewsCard } from "./NewsCard";
import { ControllerModal } from "./ResourceFlow/ResourceFlowController";
import { UploadComponent } from "./UploadComponent";
import { VideoCard } from "./VideoCard";

export const Resources = () => {
  const { backend } = useBackendContext();
  const [searchInput, setSearchInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const { role } = useAuthContext();

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFilterToggle = (id) => () => {
    console.log(`Tag ${id} has been toggled!`);
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddButtonClick = () => {
    console.log("Add button clicked!");

    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
    }, 0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await backend.get("/articles/with-tags");
      setArticles(newsResponse.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get("/tags");
      const initialTagFilter = {};
      const initialTags = {};
      tagsResponse.data.forEach((tag) => {
        initialTagFilter[tag.id] = false;
        initialTags[tag.id] =
          tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
      });

      setTagFilter(initialTagFilter);
      setTags(initialTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const searchVideos = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(
          `/classes-videos/with-tags/search/${searchInput}`
        );
        // console.log("Search results:", response.data);
        setVideos(response.data);
      } catch (error) {
        console.error(
          `Error fetching videos with query '${searchInput}':`,
          error
        );
      }
    } else {
      try {
        const response = await backend.get("/classes-videos/with-tags");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching class videos:", error);
      }
    }
  };

  // allow search functionality for articles
  const searchArticles = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(
          `/articles/with-tags/search/${searchInput}`
        );
        setArticles(response.data);
      } catch (error) {
        console.error(
          `Error fetching articles with query '${searchInput}':`,
          error
        );
      }
    } else {
      try {
        const response = await backend.get("/articles/with-tags");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      if (!query) {
        if (tabIndex === 0) {
          const res = await backend.get("/classes-videos/with-tags");
          setVideos(res.data);
        }
        if (tabIndex === 1) {
          const res = await backend.get("/articles/with-tags");
          setArticles(res.data);
        }
      } else {
        if (tabIndex === 0) {
          const res = await backend.get(
            `/classes-videos/with-tags/search/${query}`
          );
          setVideos(res.data);
        } else if (tabIndex === 1) {
          const res = await backend.get(`/articles/with-tags/search/${query}`);
          setArticles(res.data);
        }
      }
    } catch (err) {
      console.log("Error fetching search:", err);
    }
  };

  useEffect(() => {
    if (tabIndex == 0) {
      // only fetch videos
      console.log(tabIndex);
      searchVideos(); // Fetch videos initially
    } else if (tabIndex === 1) {
      searchArticles();
    }
    fetchNews(); // Fetch news initially
    fetchTags(); // Fetch tags initially
  }, [tabIndex]);

  return (
    <Box
      position="relative"
      pb="70px"
      minHeight="100vh"
    >
      <Flex
        direction="column"
        p={4}
      >
        {/* place Videos and News cards into separate tabs */}
        <Tabs
          colorScheme="purple"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <Center>
            <TabList>
              <Tab
                fontWeight="bold"
                _selected={{
                  borderBottom: "2px",
                  borderColor: "purple.600",
                  fontWeight: "bold",
                  color: "purple.600",
                }}
              >
                Videos
              </Tab>
              <Tab
                fontWeight="bold"
                _selected={{
                  borderBottom: "2px",
                  borderColor: "purple.600",
                  fontWeight: "bold",
                  color: "purple.600",
                }}
              >
                Articles
              </Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <Box mb={4}>
                <SearchBar
                  onSearch={handleSearch}
                  tags={tags}
                  tagFilter={tagFilter}
                  backend={backend}
                  onTag={handleFilterToggle}
                />
              </Box>
              {role !== "student" && (
                <HStack
                  align="center"
                  justify="center"
                  mb={4}
                  bg="gray.50"
                  border="1px"
                  borderRadius="lg"
                  borderColor={"gray.300"}
                  onClick={handleAddButtonClick}
                  cursor="pointer"
                  p={4}
                >
                  <Text
                    fontWeight={"bold"}
                    fontSize={"xl"}
                  >
                    Add a Video
                  </Text>
                  <Text
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                  >
                    +
                  </Text>
                </HStack>
              )}

              <Flex
                wrap="wrap"
                gap={4}
              >
                {videos.map((video) => {
                  const isFilterActive = Object.values(tagFilter).some(Boolean);

                  if (
                    !isFilterActive ||
                    (video.tags && video.tags.some((tag) => tagFilter[tag]))
                  ) {
                    return (
                      <VideoCard
                        key={video.id}
                        id={video.id}
                        description={video.description}
                        title={video.title}
                        S3Url={video.s3Url}
                        classId={video.classId}
                        classTitle={video.classTitle}
                        mediaUrl={video.mediaUrl}
                        firstName={video.firstName}
                        lastName={video.lastName}
                        tags={video.tags?.map((tag) => tags[tag] || [])}
                      />
                    );
                  }
                })}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Box mb={4}>
                <SearchBar
                  onSearch={handleSearch}
                  tags={tags}
                  tagFilter={tagFilter}
                  backend={backend}
                  onTag={handleFilterToggle}
                />
              </Box>
              {role !== "student" && (
                <HStack
                  align="center"
                  justify="center"
                  mb={4}
                  bg="gray.50"
                  border="1px"
                  borderRadius="lg"
                  borderColor={"gray.300"}
                  onClick={handleAddButtonClick}
                  cursor="pointer"
                  p={4}
                >
                  <Text
                    fontWeight={"bold"}
                    fontSize={"xl"}
                  >
                    Add an Article
                  </Text>
                  <Text
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                  >
                    +
                  </Text>
                </HStack>
              )}
              <Flex
                wrap="wrap"
                gap={4}
              >
                {articles.map((article) => {
                  const isFilterActive = Object.values(tagFilter).some(Boolean);

                  if (
                    !isFilterActive ||
                    (article.tags && article.tags.some((tag) => tagFilter[tag]))
                  ) {
                    return (
                      <NewsCard
                        key={article.id}
                        id={article.id}
                        S3Url={article.s3Url}
                        description={article.description}
                        mediaUrl={article.mediaUrl}
                        firstName={article.firstName}
                        lastName={article.lastName}
                        tags={article.tags?.map((tag) => tags[tag] || [])}
                      />
                    );
                  }
                })}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* <UploadComponent /> */}
      </Flex>
      {showModal && <ControllerModal autoOpen={true} />}
      <Navbar />
    </Box>
  );
};
