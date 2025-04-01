import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react_query/queriesAndMutation";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: post,
    isPending: isPostLoading,
    isError: isPostError,
  } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-screen flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full ">
            Home Feed
          </h2>
          {isPostLoading && !post ? (
            <Loader />
          ) : (
            <ul className="flex flex-1 flex-col gap-9 w-full">
              {post?.documents.map((p: Models.Document) => (
                <PostCard post={p} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
