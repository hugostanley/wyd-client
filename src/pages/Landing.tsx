import { Menu, Squirrel, X } from "lucide-react";
import { Link } from "react-router-dom";
import { globals } from "../config/globals";
import gif from '../assets/mobile.gif'
import screenshot from '../assets/login-screenshot.png'
import { useState } from "react";

export default function Landing() {
  const [navMenuClicked, setNavMenuClicked] = useState<boolean>(false)
  return (
    <>
      <header className="w-screen mb-10">
        <nav className="flex flex-col w-full p-6 z-50 md:p-10 lg:px-32 ">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Squirrel size={30} />
            </div>
            <div className="hidden sm:block">
              <ul>
                <li className="flex gap-4 items-center">
                  <Link to="#">Features</Link>
                  <Link to="#">Pricing</Link>
                  <Link to={globals.FE_ENDPOINTS.LOGIN} className="px-4 py-2 border border-slate-200 shadow-sm rounded-md">Login</Link>
                </li>
              </ul>
            </div>
            <div className="sm:hidden">
              {!navMenuClicked && (
                <Menu className="cursor-pointer" onClick={() => setNavMenuClicked(true)} />
              )}

              {navMenuClicked && (
                <X className="cursor-pointer" onClick={() => setNavMenuClicked(false)} />
              )}
            </div>
          </div>
          {navMenuClicked && (
            <div className="w-full py-6 flex flex-col items-center gap-2 border-b border-b-slate-200">
              <Link to="#">Features</Link>
              <Link to="#">Pricing</Link>
              <Link to={globals.FE_ENDPOINTS.LOGIN} className="px-4 py-2 border border-slate-200 shadow-sm rounded-md">Login</Link>
            </div>
          )}
        </nav>
      </header>
      <main className="pb-10 flex flex-col w-screen justify-center items-center gap-4 px-4">
        <h1 className="font-bold text-5xl">Never miss a thing.</h1>
        <span className="">Do your tasks while letting your friends know.</span>
        <Link to={globals.FE_ENDPOINTS.REGISTER} >
          <button className="shadow-lg text-xl font-bold bg-indigo-500 px-5 py-2 rounded-lg text-white mb-16">Get started</button>
        </Link>
        <div className="w-[90%] relative h-[23rem] sm:h-[25rem] md:h-[27rem] lg:h-[29rem] rounded-xl shadow-2xl flex justify-center items-center bg-gray-200 sm:w-[80%] md:w-[70%] lg:w-[60%]">
          <img src={screenshot} className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto" />
          <img src={screenshot} className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto" />
          <div className="absolute top-20 sm:top-24 md:top-28 lg:top-32">
            <img src={gif} className="w-28 sm:w-32 md:w-36 h-auto" />
          </div>
        </div>
      </main>
      <footer className="w-full flex justify-start items-start p-4 gap-2 text-gray-500">
        <p className="text-xs">© 2023 Stanley Hugo. All rights reserved.</p>
      </footer>
    </>
  )
}
