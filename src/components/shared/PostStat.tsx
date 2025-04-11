import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react_query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatProps = {
  post?: Models.Document;
  userId: string;
};

const PostStat = ({ post, userId }: PostStatProps) => {
  //figure out what are the current like on a specific post
  const likedList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likedList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeleting } = useDeleteSavePost();

  //get the data of which user is logged in
  const { data: currentUser } = useGetCurrentUser();

  //check if the user has saved the post
  const savedRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  //changes the state of the post based on user 's action
  useEffect(() => {
    setIsSaved(savedRecord ? true : false);
  }, [currentUser]);

  //function to like a post
  const handleLike = (e: React.MouseEvent) => {
    //stops event form reaching parent class
    e.stopPropagation();

    let newLikes = [...likes];

    //check if the user has liked the post
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      //means the user is unliking the post
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      //means the user is liking the post
      newLikes.push(userId);
    }
    //update the state of likes
    setLikes(newLikes);
    //update the attribute in teh backend/ appwrite
    likePost({ postId: post?.$id || "", likedArray: newLikes });
  };

  //function to save a post
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedRecord) {
      setIsSaved(false);
      deleteSavePost(savedRecord.$id);
    } else {
      savePost({ postId: post?.$id || "", userId: userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likedList, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={22}
          height={22}
          className="cursor-pointer"
          onClick={(e) => handleLike(e)}
        />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
          {likes.length}
        </p>
      </div>
      <div className="flex gap-2">
        {isSaving || isDeleting ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={22}
            height={22}
            className="cursor-pointer"
            onClick={(e) => handleSave(e)}
          />
        )}
      </div>
    </div>
  );
};

export default PostStat;
