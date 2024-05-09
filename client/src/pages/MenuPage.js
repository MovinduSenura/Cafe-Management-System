import axios from "axios";
import React, { useEffect, useState } from "react";
import menuicons from '../images/menuicons.png'
import './MenuPage.css'

const MenuPage = () => {

    const [ MenuAllItems, setMenuAllItems ] = useState([]);
    const [ MenuItemName , setMenuItemName ] = useState('');
    const [ AllOriginalMenuItems , setAllOriginalMenuItems ] = useState([]);

    useEffect(() => {

        const getMenuAllItems = async () => {

            try{

                await axios.get('http://localhost:8000/menu/menuItems')
                .then((res) => {
                    setMenuAllItems(res.data.AllmenuItems);
                    setAllOriginalMenuItems(res.data.AllmenuItems);
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

    //search function

    const SearchFunction = async (searchTerm) => {

        try{
            await axios.get('http://localhost:8000/menu/searchmenuItem', {
            params: {
                menuItemName: searchTerm
            }})
            .then((res) => {
                if(res.data.searchedmenuItem.length === 0){
                    setMenuAllItems(res.data.searchedmenuItem);
                }
                else{
                    setMenuAllItems(res.data.searchedmenuItem);
                    console.log(res.data.message);
                }
            })
            .catch((error) => {
                console.log("☠️ :: Error on response from server! ERROR : ", error.message);
            })

        }catch(err){
            console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
        }
    }


    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setMenuItemName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
            setMenuAllItems(AllOriginalMenuItems); // Fetch all data when search term is empty
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(MenuItemName);
    };

  return (
    <div className="menuitemsmaindiv">
        <div className="tableHead">
            <div className="search-container">
                <form className="searchTable" onSubmit={handleFormSubmit}>
                    <input id="searchBar" type="text" value={MenuItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                    <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                </form>
            </div>
        </div>
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

            {MenuAllItems.map((menuitem) => (  
                <div className="menucard">
                    <div className="submenucard">
                        <img 
                            src={require(`../../../frontend/src/uploads/${menuitem.menuItemImage}`)}
                            width={90}
                            height={100}
                            alt="menuItemImage" 
                        />
                    </div>
                    <h4 className="nameh4">{menuitem.menuItemName}</h4>
                    <h2 className="priceh2">{menuitem.menuItemPrice} LKR</h2>
                    {menuitem.popular && <span className="popularLabel">*Most Popular*</span>}
                </div>
            ))}    
                               
        </div>
    </div>
  )
}

export default MenuPage