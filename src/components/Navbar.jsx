import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { gapiLoad } from "utils/startGoogleApi";
import Logout from "./Logout";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-[1.75rem] justify-between">
      <div className="flex justify-start items-center w-[80%] px-2 rounded-lg bg-white border-none outline-none focus-within:drop-shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          autoFocus
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user.image}
            alt="user"
            className="w-14 h-12 rounded-lg"
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link
          to={`create-pin`}
          state={"/"}
          className="bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        >
          <IoMdAdd />
        </Link>
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
