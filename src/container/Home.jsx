import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
// react-router-dom
import { Link, Route, Routes } from "react-router-dom";
// Component
import { Sidebar, UserProfile } from "components";
// Sanity client
import { client } from "client";
// logo
import logo from "assets/logo.png";
// Container
import Pins from "./Pins";
// Hooks
import { useToggle } from "ahooks";
// Utils
import { userQuery } from "utils/data";
import { fetchUser } from "utils/fetchUser";

const Home = () => {
  const [state, { toggle, setLeft, setRight }] = useToggle();

  const toggleState = state;

  const [user, setUser] = useState(null);

  const localStoreUser = localStorage.getItem("user");

  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
    return () => {};
  }, []);

  return (
    <div className="flex bg-grey-500 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={toggle} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-[28px] h-[28px]" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-[28px] h-[28px]" />
          </Link>
        </div>
        {toggleState && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={toggle}
              />
            </div>
            <Sidebar user={user && user} closeToggle={toggle} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-auto" ref={scrollRef}>
        <Routes>
          <Route path="/user-profie/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
