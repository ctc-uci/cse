import {
    Box,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
  } from '@chakra-ui/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from "zod";

const createArticleSchema = z.object({
    photo: z.string(),
    link: z.string().url("Please enter a valid url."),
    tag: z.string().min(1, "You must include at least one tag."),
    textInput: z.string().min(1, "Please write a description of the article."),
    title: z.string().min(1, "Your article must include a title.")
});

type ArticleFormValues = z.infer<typeof createArticleSchema>;

const CreateArticle = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ArticleFormValues>({
        resolver: zodResolver(createArticleSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: ArticleFormValues) => {
        try {
            const response = await fetch("/articles/search/:title", {
                method: "POST",
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            console.log("Successfully submitted article.")
            alert("Article submitted successfully!")
        } catch (error) {
            console.log("Error submitting article:", error);
            alert("Failed to submit article.");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <FormLabel>Select media to upload.</FormLabel>
                <Input
                    placeholder="Photo"
                    ></Input>
                <Input
                    placeholder="Link"
                    type="link"
                    size={"lg"}
                    {...register("link")}
                    name="link"
                    isRequired
                    autoComplete="link"
                ></Input>
            </FormControl>
            <FormControl>
                <FormLabel>Select tags for media.</FormLabel>
                <div>
                    <Button>Ballet</Button>
                    <Button>Classical</Button>
                    <Button>Custom</Button>
                </div>
            </FormControl>
            <FormControl>
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
                <FormErrorMessage>Title is required.</FormErrorMessage>
            </FormControl>
                <Button
                    type="submit"
                    size={"lg"}
                    sx={{width: "100% "}}
                >Next</Button>
                {/* insert review section */}
            </form>
        </Box>
  )
}

export default CreateArticle;