import React from 'react'
import AboutUSDeco1 from '../images/AboutUSDeco_1.png'
import AboutUSDeco2 from '../images/AboutUSDeco_2.png'
import AboutUSImage from '../images/aboutUsImage.png'
import './About.css'

const About = () => {
  return (
    <div className="secondSectorHome">
        <div className="secondSecOverlay">
            <div className="secondSectorAlignDiv">
                <div className="widthContiner">
                    <div className="AboutTextContainer">
                        <img src={AboutUSDeco1} alt="About Us Deco 1" />
                        <h1>About Us</h1>
                        <img src={AboutUSDeco2} alt="About Us Deco 2" />
                    </div>
                    <div className="aboutSpanText">
                        <p>Welcome to Espresso Elegance, where the classy appeal of Marine Drive, Colombo, combines with the enchanting aroma of freshly made coffee and pastries.</p>
                    </div>
                </div>
                <div className="aboutUsContent">
                    <div className="aboutWidthContentContiner">
                        <p className="column">
                            Welcome to Espresso Elegance, the brainchild of owner Thilan Manamperi, located along the vibrant Marine Drive in Colombo.<br/> <br/>
                            Since 2023, under Thilan's guidance, we've dedicated ourselves to providing a haven where coffee aficionados and pastry lovers alike can indulge in the finest offerings.<br/> <br/>
                            With a commitment to freshness and quality ingrained in our ethos, every cup of coffee and each pastry served reflects Thilan's passion for excellence.<br/> <br/>
                            Join us at Espresso Elegance and experience the vision of Thilan Manamperi come to life, where every sip and every bite is a testament to our dedication to perfection.
                        </p>
                        <img src={AboutUSImage} className="column" alt="About Us" />
                    </div>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default About