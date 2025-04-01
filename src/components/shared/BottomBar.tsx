import { bottombarLinks } from "@/constants/Links";
import { INavLink } from "@/types/type";
import { Link, NavLink, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="flex z-50 justify-between items-center w-full sticky bottom-0 rounded-t-[20px] bg-[#09090A] px-5 py-4 md:hidden">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
          <NavLink
            to={link.route}
            key={link.label}
            className={` 
              ${
                isActive && "bg-[#877EFF] rounded-[10px] "
              }  flex justify-center items-center flex-col w-full p-2 gap-1 transition `}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={18}
              height={18}
              className={`group-hover:invert brightness-0 transition ${
                isActive && "invert brightness-0 transition"
              } `}
            />
            <p className=" text-[#EFEFEF] text-[10px] font-medium leading-[140%] ">
              {link.label}
            </p>
          </NavLink>
        );
      })}
    </section>
  );
};

export default BottomBar;
