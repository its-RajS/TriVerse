import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/lib/react_query/queriesAndMutation";

const PostForm = ({ post }: { post?: Models.Document }) => {
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) return toast("Post Not Created");

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="h-36 bg-[#101012] rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">
                Add Photos
              </FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imgUrl}
                />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">
                Add Location
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className=" h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">
                Add Tags(seperated by comas " , ")
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Art, Expression, Learn"
                  className=" h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3] !important"
                />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between ">
          <Button
            type="button"
            className=" bg-[#1F1F22] p-5 text-[#FFFFFF] flex gap-2 !important hover:bg-[#FF5A5A]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className=" bg-[#877EFF] p-5 hover:bg-[#877EFF] text-[#FFFFFF] flex gap-2 !important"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
