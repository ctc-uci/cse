import {
    Box,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Stack,
    VStack,
  } from '@chakra-ui/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { z } from "zod";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const createArticleSchema = z.object({
    s3_url: z.string(),
    media_url: z.string().url("Please enter a valid URL."),
    description: z.string().min(1, "Please write a description of the article."),
    title: z.string().min(1, "Your article must include a title.")
});

const CreateArticle = () => {
    const { backend } = useBackendContext();
    const [fileName, setFileName] = useState("");

    const [activeButton, setActiveButton] = useState(null);
    const toggleButton = (tag) => {
        setActiveButton(activeButton === tag ? null : tag);
    }
    
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFileName(selectedFile.name);

            const formData = new FormData();
            formData.append("file", selectedFile);
        }

        const testURL = "https://wawawa.com/ok.jpg";
        setValue("s3_url", testURL, { shouldValidate: true });
    }

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createArticleSchema),
        mode: "onBlur",
    });

    const postArticle = async (data) => {
        console.log("Submitting article with data:", data);
        
        try {
            const response = await backend.post("/articles", {
                s3_url: data.s3_url ?? "",
                media_url: data.media_url ?? "",
                description: data.title ?? "",
            });

            if (!response) {
                throw new Error("Failed to submit article.");
              }
    
            console.log("Successfully submitted article.")
            alert("Article submitted successfully!")
        } catch (error) {
            console.log("Error submitting article:", error);
            alert("Failed to submit article.");
        }
    };

    const [selectTags, setSelectTags] = useState([]);

    const tags = ["Ballet", "Classical", "Custom"];

    const handleTags = (tag) => {
        let newTags;
        if (selectTags.includes(tag)) {
            newTags = selectTags.filter((t) => t !== tag);
        } else {
            newTags = [...selectTags, tag]
        }

        setSelectTags(newTags);
        setValue("tag", newTags, {shouldValidate: true});
    }

    return (
    <VStack
      spacing={8}
      sx={{ width: 300, marginX: "auto" }}
    >
        <Box display="flex" justifyContent="center" alignItems="center">
            <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log("form submitted");
                handleSubmit(postArticle)();
            }}>
            <FormControl isInvalid={!!errors.s3_url}>
                <FormLabel>Select media to upload.</FormLabel>
                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    id="button-file"
                    onChange={handleFileChange}
                    />
                <Button
                    variant="contained"
                    bg="gray.100"
                    _hover={{ bg: "teal.500 "}}
                    _active={{ bg: "teal.700" }}
                    colorScheme="teal"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload Media
                </Button>
                {fileName && (
                    <Box mt={2} color="gray.600">
                        {fileName}
                    </Box>
                )}
                <FormErrorMessage>
                    {errors.s3_url?.message?.toString()}
                </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.media_url}>
                <Input
                    placeholder="Media URL"
                    type="link"
                    size={"lg"}
                    {...register("media_url")}
                    name="media_url"
                    isRequired
                    autoComplete="media_url"
                ></Input>
                <FormErrorMessage>{errors.media_url?.message?.toString()}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.tag}>
                <FormLabel>Select tags for media.</FormLabel>
                <Stack direction="row" spacing={1}>
                    <Button
                        onClick={() => toggleButton("ballet")}
                        colorScheme={activeButton === "ballet" ? "teal" : "gray"}
                    >
                    Ballet
                    </Button>
                    <Button
                    onClick={() => toggleButton("classical")}
                    colorScheme={activeButton === "classical" ? "teal" : "gray"}
                    >
                    Classical
                    </Button>
                    <Button
                    onClick={() => toggleButton("custom")}
                    colorScheme={activeButton === "custom" ? "teal" : "gray"}
                    >
                    Custom
                    </Button>
                </Stack>
                <FormErrorMessage>{errors.tag?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.title}>
                <FormLabel>Add a title.</FormLabel>
                <Input
                    placeholder="Add title here."
                    type="title"
                    size={"lg"}
                    {...register("title")}
                    name="title"
                    isRequired
                    autoComplete="title"
                    ></Input>
                <FormErrorMessage>{errors.title?.message?.toString()}</FormErrorMessage>
            </FormControl>
                <Button
                    type="submit"
                    size={"lg"}
                    _hover={{ bg: "teal.500 "}}
                    _active={{ bg: "teal.700" }}
                    sx={{width: "100% "}}
                    isDisabled={Object.keys(errors).length > 0}
                >Next</Button>
            </form>
        </Box>
    </VStack>
  )
}

export default CreateArticle;