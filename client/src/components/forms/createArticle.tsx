import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Stack,
    VStack,
  } from '@chakra-ui/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const createArticleSchema = z.object({
    s3_url: z.string(),
    media_url: z.string().url("Please enter a valid URL."),
    tag: z.array(z.string()).min(1, "You must include at least one tag."),
    description: z.string().min(1, "Please write a description of the article."),
    title: z.string().min(1, "Your article must include a title.")
});

type ArticleFormValues = z.infer<typeof createArticleSchema>;

const CreateArticle = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ArticleFormValues>({
        resolver: zodResolver(createArticleSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: ArticleFormValues) => {
        try {
            const response = await fetch("/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to submit article.");
            }
    
            console.log("Successfully submitted article.")
            alert("Article submitted successfully!")
        } catch (error) {
            console.log("Error submitting article:", error);
            alert("Failed to submit article.");
        }
    };

    const [selectTags, setSelectTags] = useState<string[]>([]);

    const tags = ["Ballet", "Classical", "Custom"];

    const handleTags = (tag: string) => {
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
            <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.s3_url}>
                <FormLabel>Select media to upload.</FormLabel>
                <Input
                    placeholder="s3 URL"
                    size={"lg"}
                    {...register("s3_url")}
                    name="photo"
                    isRequired
                    autoComplete="s3Url"
                    ></Input>
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
                <Stack direction="row">
                    {tags.map((tag) => (
                         <Button
                         key={tag}
                        onClick={() => handleTags(tag)}
                     >
                         {tag}
                     </Button>
                    ))}
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
                    sx={{width: "100% "}}
                    isDisabled={Object.keys(errors).length > 0}
                >Next</Button>
                {/* insert review section */}
            </form>
        </Box>
    </VStack>
  )
}

export default CreateArticle;