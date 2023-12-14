import React from "react";
import { mapList } from "./CountUpdate";
import { itemPrice } from "../Pages/FoodPage";
let itemNameArray = [];
let countArray = [];
// values are passed to trollypopwindow
export let iteamNameBackend = [];
export let priceBackend = [];
export let quantityBackend = [];
export let totalAmountBackend = [];
export let netAmountBackend = 0;
export let iteamName;
function Cart() {
    function CartClick() {
        window.scrollTo(0, 0);
        priceBackend = [];
        totalAmountBackend = [];
        document.getElementById("trolly_click_display_appera").style.marginTop = "0px";
        let trolly_text_box = document.getElementById("trolly_text_box");

        itemNameArray = Array.from(mapList.keys());
        countArray = Array.from(mapList.values());
        iteamNameBackend = Array.from(mapList.keys());
        quantityBackend = Array.from(mapList.values());


        let netAmount = 0;
        iteamName = `<table class="col-12"><tr style="text-align:center">
        
         <th>Iteam</th>
         <th>Price</th>
         <th>Quantity</th>
         <th>Amount</th>
         
     </tr>
     <tr><td colSpan=4><hr/><td/><tr/>`;

        for (let i = 0; i < itemNameArray.length; i++) {
            let amount = Number(countArray[i]) * Number(itemPrice.get(itemNameArray[i]));
            netAmount += amount;
            priceBackend.push(itemPrice.get(itemNameArray[i]));
            totalAmountBackend.push(amount);
            iteamName += `<tr style="text-align:center">
            <td style="word-break:break-all">${itemNameArray[i]}</td>
            <td style="word-break:break-all">${itemPrice.get(itemNameArray[i])}</td>
            <td style="word-break:break-all">${countArray[i]}</td>
            <td style="word-break:break-all">${amount}<td/>

        </tr>`
            iteamName += `<tr><td colSpan=4><hr/><td/><tr/>`
        }
        iteamName += `<tr style="text-align:center">
        <th colSpan=3 style="text-align:end;word-break:break-all">Net Amount:</th>
        <th>${netAmount}</th>
        </tr>
        <tr><td colSpan=4><hr/><td/><tr/>`
        netAmountBackend = netAmount;
        trolly_text_box.innerHTML = iteamName + `</table>`;

    }
    return (
        <div className=" d-flex justify-content-center align-items-center trolly_cart deactivate" id="cart_container" style={{ cursor: "pointer" }} onClick={CartClick}>
            <i className="fa-solid fa-cart-shopping"></i>
            <span id="total_iteam_count" className="d-flex justify-content-center align-items-center">0</span>
        </div>
    );
}
export default Cart;