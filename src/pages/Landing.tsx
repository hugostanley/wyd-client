import { Squirrel } from "lucide-react";
import { Link } from "react-router-dom";
import { globals } from "../config/globals";
import gif from '../assets/mobile.gif'

export default function Landing() {
  return (
    <>
      <header className="w-screen mb-10">
        <nav className="flex justify-between px-32 py-10">
          <div className="flex items-center">
            <Squirrel size={30}/>
          </div>
          <div>
            <ul>
              <li className="flex gap-4 items-center">
                <Link to="#">Features</Link>
                <Link to="#">Pricing</Link>
                <Link to={globals.FE_ENDPOINTS.LOGIN} className="px-4 py-2 border border-slate-200 shadow-sm rounded-md">Login</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main className="pb-10 flex flex-col w-screen justify-center items-center gap-4">
        <h1 className="font-bold text-5xl">Never miss a thing.</h1>
        <span className="">Do your tasks while letting your friends know.</span>
        <button className="shadow-lg text-xl font-bold bg-indigo-500 px-5 py-2 rounded-lg text-white mb-20">Get started</button>
        <div className="w-[45rem] h-[35rem] rounded-xl shadow-2xl flex justify-center items-center bg-gray-200">
          <img src={gif} className="w-48 h-auto"/>
        </div>
      </main>
    </>
  )
}
