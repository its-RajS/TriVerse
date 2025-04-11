import { useUserContext } from "@/context/AuthContext";
import { GridPostListType } from "@/types/type";
import { Link } from "react-router-dom";
import PostStat from "./PostStat";

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListType) => {
  const { user } = useUserContext();

  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80 ">
          <Link
            to={`/post/${post.$id}`}
            className="flex rounded-[24px] border border-[#ffffff] overflow-hidden cursor-pointer w-full h-full"
          >
            <img
              src={post?.imageUrl}
              alt="post"
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="absolute bottom-0 p-5 flex justify-between items-center w-full bg-gradient-to-t from-[#101012] to-transparent rounded-b-[24px] gap-2">
            {showUser && (
              <div className="flex justify-start items-center gap-2 ">
                <img
                  src={post.creator.imageUrl}
                  alt="creator"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.username}</p>
              </div>
            )}
            {showStats && <PostStat post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
