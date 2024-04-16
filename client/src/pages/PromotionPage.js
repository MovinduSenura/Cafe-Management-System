import axios from "axios";
import React, { useEffect, useState } from "react";
// import React from "react";
import menuicons from '../images/menuicons.png'
import './PromotionPage.css'

const PromotionPage = () => {

    const [ allPromotions, setAllPromotion ] = useState([]);

    useEffect(() => {

      const getAllPromotions = async () => {
        try{
          
          await axios.get('http://localhost:8000/promotion/promotions')
          .then((res) => {
            setAllPromotion(res.data.Allpromotions);
            console.log(res.data.Allpromotions);
            console.log('status: ' + res.data.status);
          })
          .catch((err) => {
            console.log('☠️ :: Error on API URL! ERROR: ', err.message);
          })

        }catch(err) {
         
          console.log('☠️ :: getAllPromotions function failed! ERROR: ' + err.message)
        }
      }

      getAllPromotions();

    }, [])

  return (
    <div className="promotionitemsmaindiv">
              
        <div className="SectorPromotion">
            <div className="SecOverlay2">
                <div className="SectorAlignDiv2">
                    <div className="promotionInfoContainer">
                        <h1>Promotions</h1>
                    </div>
                    <div className="promotionIconsContainer">
                        <img src={menuicons} alt="menuicons" />
                    </div>
                </div>
            </div>    
        </div>

        <div className='promotionItemsSector'>

            <h2 className="promotiontopic">Current Deals</h2>

            {allPromotions.map((promotion) => (  
                <div className="promotioncard">
                    <div className="subpromotioncard">
                        <img 
                            src={require(`../../../frontend/src/uploads/${promotion.promotionItempic}`)}
                            // width={90}
                            // height={100}
                            alt="promotionItemImage" 
                        />
                    </div>
                    <h4 className="promotionnameh4">{promotion.promotionName}</h4>
                    <h2 className="promotionvalueh2">{promotion.promotionValues}%</h2>
                </div>
            ))}
        </div>

    </div>
  )
}

export default PromotionPage