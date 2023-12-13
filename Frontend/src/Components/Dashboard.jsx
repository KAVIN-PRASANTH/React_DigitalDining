import React from "react";
import Cart from "../Components/Cart";
import Home from "../Pictures/home.png"
import Profile from "../Pictures/profile.png"
import { useNavigate } from "react-router-dom";

function Dashboard() {
   let navigate=useNavigate();
   function HomePage() {
      let home_icon = document.getElementById("home_icon");
      let profile_icon = document.getElementById("profile_icon");
      let cart_container = document.getElementById("cart_container");

      document.getElementById("trolly_click_display_appera").style.marginTop = "-1000px";

      cart_container.classList.add("deactivate");
      cart_container.classList.remove("active");
      home_icon.classList.add("active");
      home_icon.classList.remove("deactivate")
      profile_icon.classList.add("deactivate");
      profile_icon.classList.remove("active")
      navigate("/FoodPage");
   }
   function ProfilePage() {
      let home_icon = document.getElementById("home_icon");
      let profile_icon = document.getElementById("profile_icon");
      let cart_container = document.getElementById("cart_container");

      cart_container.classList.add("deactivate");
      cart_container.classList.remove("active");
      home_icon.classList.add("deactivate");
      home_icon.classList.remove("active")
      profile_icon.classList.add("active");
      profile_icon.classList.remove("deactivate");
      navigate("/Profile")

   }
   function CartClick() {
      let home_icon = document.getElementById("home_icon");
      let profile_icon = document.getElementById("profile_icon");
      let cart_container = document.getElementById("cart_container");

      cart_container.classList.add("active");
      cart_container.classList.remove("deactivate");
      home_icon.classList.add("deactivate");
      home_icon.classList.remove("active")
      profile_icon.classList.add("deactivate");
      profile_icon.classList.remove("active");
      navigate("/Foodpage");
     
   }
   return (
      <div className="dashboard_container  row d-flex justify-content-center align-items-center container">
         <div className="d-flex justify-content-around align-items-center col-10">
            <div className="active rounded-circle p-2 " id="home_icon" onClick={HomePage} ><img style={{ width: "30px", height: "30px", cursor: "pointer" }} src={Home} alt="Error" /></div>
            <div id="cart_box" onClick={CartClick}><Cart /></div>
            <div className="deactivate rounded-circle p-2" id="profile_icon" onClick={ProfilePage} ><img style={{ width: "30px", height: "30px", cursor: "pointer" }} src={Profile} alt="Error" /></div>
         </div>
      </div>
   )
}
export default Dashboard;