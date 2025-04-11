import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStat from "./PostStat";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  //use the context to know if its the user post
  const { user } = useUserContext();

  console.log("Post IMage URL:", post?.imageUrl);

  //means somethig went wrong
  if (!post.creator) return null;

  // console.log("Img Url: ", post?.imageUrl);

  return (
    <div className="bg-[#09090A] rounded-3xl border border-[#1F1F22] p-5 lg:p-7 w-full max-w-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`} className="cursor-pointer">
            <img
              src={post?.creator?.imageUrl}
              alt="creator"
              className="rounded-full w-12 lg:h-12 "
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-[#FFFFFF] text-[16px] font-medium leading-[140%] lg:text-[18px] lg:font-bold">
              {post.creator.username}
            </p>
            <div className="flex flex-col justify-items-center text-[#7878A3] ">
              <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                {formatDateString(post.$createdAt)}
              </p>
              <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/edit-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"} `}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className="text-[14px] font-medium leading-[140%] lg:text-[16px] py-5">
          <p>{post?.caption} </p>
          <ul className="flex gap-1 mt-2">
            {post?.tags?.map((tag: string, index: number) => (
              <li key={index} className="text-[#7878A3] ">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post?.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post img"
          className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"
          onError={(e) => console.log("Image load error:", e)} // Debug load failures
        />
      </Link>

      <PostStat post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
