import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react_query/queriesAndMutation";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate("/sign-in");
  }, [isSuccess]);

  return (
    <section className="w-full top-0 z-50 sticky bg-[#09090A] md:hidden ">
      <div className=" flex justify-between items-center py-4 px-5 ">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white !important cursor-pointer "
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex justify-items-center gap-3"
          >
            <img
              src={user.imgUrl}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
