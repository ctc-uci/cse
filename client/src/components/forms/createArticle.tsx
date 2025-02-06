import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

import { z } from "zod";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const createArticleSchema = z.object({
  s3_url: z.string(),
  media_url: z.string().url("Please enter a valid URL."),
  tag: z.array(z.string()).min(1, "You must include at least one tag."),
  description: z.string().min(1, "Please write a description of the article."),
  title: z.string().min(1, "Your article must include a title."),
});

type ArticleFormValues = z.infer<typeof createArticleSchema>;

const CreateArticle = () => {
  const [articleData, setArticleData] = useState<ArticleFormValues | null>({
    s3_url: "",
    media_url: "",
    tag: [],
    description: "",
    title: "",
  });
  const [errors, setErrors] = useState({
    s3_url: false,
    media_url: false,
    tag: false,
    title: false,
  });
  const validateForm = () => {
    const newErrors = {
      title: articleData?.title.trim() === "",
      media_url: articleData?.media_url.trim() === "",
      s3_url: articleData?.s3_url.trim() === "",
      tag: articleData?.tag.length === 0,
    };
    setErrors(newErrors);

    // Returns true if there are no errors
    return (
      !newErrors.title &&
      !newErrors.media_url &&
      !newErrors.s3_url &&
      !newErrors.tag
    );
  };
  const { backend } = useBackendContext();
  const postArticle = async () => {
    console.log(validateForm());
    if (!validateForm()) return;
    try {
      const res = await backend.post("/articles", {
        s3_url: articleData?.s3_url ?? "",
        media_url: articleData?.media_url ?? "",
        description: articleData?.tag.join(", ") ?? "",
      });

      if (!res) {
        throw new Error("Failed to submit article.");
      }

      console.log("Successfully submitted article.");
      alert("Article submitted successfully!");
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
      newTags = [...selectTags, tag];
    }

    setSelectTags(newTags);
    setArticleData({ ...articleData!, tag: newTags });
    // setValue("tag", newTags, { shouldValidate: true });
  };

  return (
    <Stack
      spacing={8}
      sx={{ width: 300, marginX: "auto" }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postArticle();
        }}
      >
        <FormControl isInvalid={!!errors.s3_url}>
          <FormLabel>Select media to upload.</FormLabel>
          <Input
            placeholder="s3 URL"
            size={"lg"}
            // {...register("s3_url")}
            onChange={(e) =>
              setArticleData({ ...articleData!, s3_url: e.target.value ?? "" })
            }
            name="photo"
            isRequired
            autoComplete="s3Url"
          ></Input>
          <FormErrorMessage>{errors.s3_url?.toString()}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.media_url}>
          <Input
            placeholder="Media URL"
            type="link"
            size={"lg"}
            // {...register("media_url")}
            onChange={(e) =>
              setArticleData({
                ...articleData!,
                media_url: e.target.value ?? "",
              })
            }
            name="media_url"
            isRequired
            autoComplete="media_url"
          ></Input>
          <FormErrorMessage>{errors.media_url?.toString()}</FormErrorMessage>
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
          <FormErrorMessage>{errors.tag?.toString()}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Add a title.</FormLabel>
          <Input
            placeholder="Add title here."
            type="title"
            size={"lg"}
            // {...register("title")}
            onChange={(e) =>
              setArticleData({ ...articleData!, title: e.target.value ?? "" })
            }
            name="title"
            isRequired
            autoComplete="title"
          ></Input>
          <FormErrorMessage>{errors.title?.toString()}</FormErrorMessage>
        </FormControl>
        <Button
          size={"lg"}
          sx={{ width: "100% " }}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Stack>
  );
};

export default CreateArticle;
