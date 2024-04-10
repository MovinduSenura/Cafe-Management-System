import axios from "axios";
import React, { useEffect, useState } from "react";
import menuicons from '../images/menuicons.png'
import './MenuPage.css'

const MenuPage = () => {

    const [ MenuPage, setMenuAllItems ] = useState([]);

    useEffect(() => {

        const getMenuAllItems = async () => {

            try{

                await axios.get('http://localhost:8000/menu/menuItems')
                .then((res) => {
                    setMenuAllItems(res.data.AllmenuItems);
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log("☠️ :: Error on API URL! ERROR : ", err.message);
                })

            }catch(err){
                console.log("☠️ :: getMenuAllItems Function failed! ERROR : " + err.message);
            }

            
        }

        getMenuAllItems();

    }, [])

  return (
    <div className="menuitemsmaindiv">
        <div className="SectorMenu">
            <div className="SecOverlay">
                <div className="SectorAlignDiv">
                    <div className="menuInfoContainer">
                        <h1>Menu</h1>
                    </div>
                    <div className="menuIconsContainer">
                        <img src={menuicons} alt="menuicons" />
                    </div>
                </div>
            </div>    
        </div>

        <div className='menuItemsSector'>

            {MenuPage.map((menuitems) => (  
                <div className="menucard">
                    <div className="submenucard">
                        <img 
                            src={require(`../../../frontend/src/uploads/${menuitems.menuItemImage}`)}
                            width={90}
                            height={100}
                            alt="menuItemImage" 
                        />
                    </div>
                    <h4 className="nameh4">{menuitems.menuItemName}</h4>
                    <h2 className="priceh2">Rs.{menuitems.menuItemPrice}</h2>
                </div>
            ))}    
                               
        </div>
    </div>
  )
}

export default MenuPage