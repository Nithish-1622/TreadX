import { useState } from "react";
import { useLocation } from "react-router-dom";

import SideBar from "./Components/Navs/SideBar";
import Header from "./Components/Navs/Header";
import InitialRouter from "./Router/InitialRouter";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="font-poppins">
      {!isLoginPage && <SideBar />}
      <div className={isLoginPage ? "" : "xl:ml-64"}>
        {!isLoginPage && <Header />}
        <InitialRouter />
      </div>
    </div>
  );
}

export default App;
