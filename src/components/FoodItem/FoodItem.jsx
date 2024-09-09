/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { assets } from '../../assets/assets';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, image, price, description }) => {

    const {cartItem,addToCart,removeFromCart,url} = useContext(StoreContext);

  return (
    <div className="food-item" key={id} id='food-item'>
      <div className="food-item-img-container">
        <img className="food-item-img" src={url+"/images/"+image} alt={`${name} image`} />
        {!cartItem[id]
        ? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
        : <div className="food-item-count">
            <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p className='disp-count'>{cartItem[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
        </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
