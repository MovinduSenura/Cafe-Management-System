// import axios from "axios";
// import React, { useEffect, useState } from "react";
import React from "react";
import menuicons from '../images/menuicons.png'
import './PromotionPage.css'

const PromotionPage = () => {

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
              <h2>Content</h2>
        </div>

    </div>
  )
}

export default PromotionPage