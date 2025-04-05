import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostDetails } from "@/lib/react_query/queriesAndMutation";
import { useParams } from "react-router-dom";

const EditPost = () => {
  //get the id of teh post we want tp edit
  const { id } = useParams();
  const { data: post, isPending } = useGetPostDetails(id || "");

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className=" max-w-5xl flex justify-start items-center gap-3 w-full ">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className=" text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full ">
            {" "}
            Edit Post
          </h2>
        </div>
        <PostForm post={post} action="Update" />
      </div>
    </div>
  );
};

export default EditPost;
