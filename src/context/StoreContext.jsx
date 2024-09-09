/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create StoreContext
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    
    const [cartItem, setCartItem] = useState({});
    const url = "http://localhost:3000";
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);

    // Function to add item to cart
    const addToCart = async (itemId) => {
        if(!cartItem[itemId]){
            setCartItem((prev)=>({...prev,[itemId]:1}));
        }
        else{
            setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    };

    // Function to remove item from cart
    const removeFromCart = async (itemId) => {
        setCartItem((prev) => {
            if (prev[itemId] > 1) {
                return { ...prev, [itemId]: prev[itemId] - 1 };
            } else {
                const { [itemId]: _id, ...rest } = prev;
                return rest; // Remove item from cart if quantity is 0
            }
        });
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    };

    // Function to get cart total
    const getTotalCartAmount = () =>{
        let totalAmount = 0 ;
        for (const item in cartItem){
            if(cartItem[item] > 0){
                let itemInfo = food_list.find((product)=> product._id === item);
                totalAmount += itemInfo.price * cartItem[item];
            }
        }
        return totalAmount;
    }

    //fatch foodlist
    const fetchFoodList = async () =>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    //load cart data
    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItem(response.data.cartData);
    }
    //token save 
    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            };
        }
        loadData();
    },[])

    // Context value to provide
    const contextValue = {
        food_list,
        cartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
