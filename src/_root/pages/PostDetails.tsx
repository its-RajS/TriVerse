import Loader from "@/components/shared/Loader";
import PostStat from "@/components/shared/PostStat";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostDetails } from "@/lib/react_query/queriesAndMutation";
import { formatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostDetails(id || "");
  //know which user is logged in
  const { user } = useUserContext();

  const handleDeletePost = () => {};

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center">
      {isPending ? (
        <Loader />
      ) : (
        <div className="bg-[#09090A] w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-[#1F1F22] xl:rounded-l-[24px]">
          <img
            src={post?.imageUrl || "assets/icons/profile-placeholder.svg"}
            alt="post"
            className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-[#000000] "
          />

          <div className="bg-[#09090A] flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex justify-between items-center w-full ">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="cursor-pointer flex items-center gap-3 "
              >
                <img
                  src={post?.creator?.imageUrl}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12 "
                />
                <div className="flex flex-col">
                  <p className="text-[#FFFFFF] text-[16px] font-medium leading-[140%] lg:text-[18px] lg:font-bold">
                    {post?.creator.username}
                  </p>
                  <div className="flex flex-col justify-items-center text-[#7878A3] ">
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                      {formatDateString(post.$createdAt)}
                    </p>
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex justify-center items-center gap-1 ">
                <Link
                  to={`/edit-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`flex gap-4 items-center justify-start hover:bg-transparent hover:text-white cursor-pointer !important ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-[#1F1F22/80] " />

            <div className="flex flex-col flex-1 w-full text-[14px] font-medium leading-[140%] lg:text-[16px] lg:font-normal ">
              <p>{post?.caption} </p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag: string, index: number) => (
                  <li key={index} className="text-[#7878A3] ">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStat post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
