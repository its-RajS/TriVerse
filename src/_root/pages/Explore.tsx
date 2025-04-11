import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react_query/queriesAndMutation";
import { useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchPosts, isFetching: isSearching } =
    useSearchPosts(searchValue);

  const { data: posts, hasNextPage, fetchNextPage } = useGetPosts();

  if (!posts) {
    return (
      <div className="flex justify-between items-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const showSearchResult = searchValue !== "";
  const showPost =
    !showSearchResult &&
    posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 ">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] w-full ">
          Search Posts
        </h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-[#1F1F22] ">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="Search"
            className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-0 focus-visible:ring-offset-white ring-offset-white !important"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7 ">
          <h3 className=" text-[18px] font-bold leading-[140%] md:text-[24px]  md:tracking-tighter ">
            Popular Today
          </h3>
          <div className="flex justify-center items-center gap-3 bg-[#101012] rounded-xl px-4 py-2 cursor-pointer ">
            <p className="text-[14px] font-medium leading-[140%] md:text-[16px] text-[#EFEFEF] ">
              All
            </p>
            <img
              src="/assets/icons/filter.svg"
              alt="filter"
              width={20}
              height={20}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {showSearchResult ? (
            <SearchResults />
          ) : showPost ? (
            <p className="text-[#5C5C7B] mt-10 text-center w-full ">
              End of Posts
            </p>
          ) : (
            posts.pages.map((item, index) => (
              <GridPostList key={`pages-${index}`} posts={item.documents} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
