import { sidebarLinks } from "@/constants/Links";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react_query/queriesAndMutation";
import { INavLink } from "@/types/type";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LeftSideBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) navigate("/sign-in");
  }, [isSuccess]);

  return (
    <nav className=" hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-[#09090A]">
      <div className=" flex flex-col gap-11 ">
        <Link to="/" className="flex gap-3 items-center">
          <span className="text-[30px] font-bold leading-[140%] tracking-wider ml-8 ">
            TriVerse
          </span>
        </Link>
        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
          <img
            src={user.imgUrl}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col ">
            <p className=" text-[18px] font-medium leading-[140%] ">
              {user.name}
            </p>
            <p className="text-[14px] font-normal leading-[140%] text-[#7878A3] ">
              {" "}
              @{user.username}{" "}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6 ">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`group rounded-lg text-[16px] font-medium leading-[140%] hover:bg-[#877EFF] transition ${
                  isActive && "bg-[#877EFF] "
                } `}
              >
                <NavLink
                  to={link.route}
                  className=" flex items-center p-4 gap-4 "
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert brightness-0 transition ${
                      isActive && "invert brightness-0 transition"
                    } `}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white !important cursor-pointer "
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className=" text-[14px] font-medium leading-[140%] lg:text-[17px] ">
          Log Out
        </p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
