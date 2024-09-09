import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItem, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Collect order items
    let orderItems = food_list
      .filter((item) => cartItem[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItem[item._id],
      }));

    // Prepare order data
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      console.log("Response from server:", response.data);
      
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    }
  };

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate("/cart")
    }
    else if(getTotalCartAmount()=== 0){
      navigate("/cart")
    }
  },[token])

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
            required
          />
        </div>
        <input
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            name="zipCode"
            value={data.zipCode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip code"
            required
          />
          <input
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
