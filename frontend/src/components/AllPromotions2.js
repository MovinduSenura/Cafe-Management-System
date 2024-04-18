import React,{ useState, useEffect } from "react";
import axios from 'axios';
import {useNavigate}from"react-router-dom";
// import {Link, useNavigate}from"react-router-dom";
import './DataTable.css'

// import { ToastContainer, toast } from 'react-toastify';
//  import 'react-toastify/dist/ReactToastify.css';
//import {useNavigate} from "react-router-dom"


const AllPromotions2 = ()=> {

    const [ allPromotions, setAllPromotion ] = useState([]);
    const [ PromotionItemName , setPromotionItemName ] = useState('');
    const [ AllOriginalPromotionItems , setAllOriginalPromotionItems ] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

      const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

      const getAllPromotions = async () => {
        try{
          
          await axios.get('http://localhost:8000/promotion/promotions')
          .then((res) => {
            setAllPromotion(res.data.Allpromotions);
            setAllOriginalPromotionItems(res.data.Allpromotions);
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

    }, [navigate])


    //    const handledelete = async (id) =>{

    //         try{

    //           const confirmed  = window.confirm('Are you sure you want to delete this item?');
              
    //           if(confirmed){
    //              await axios.delete(`http://localhost:8000/promotion/deletepromotion/${id}`)
    //             .then((res) => {
    //             alert(res.data.message);
    //             console.log(res.data.message);
    //            })
    //            .catch((err) => {
    //             console.log('☠️ :: Error on API URL : ' +err.message);
    //            })            
              
    //    }else {
    //     toast.warning('Deletion cancelled');
    //     console.log('Delection cancelled');
    //    }
      
    //   }catch(err){
    //     console.log('☠️ :: handleDelete function failed ! ERROR:'+err.message);
    //   }
    //    }

    const SearchFunction = async (searchTerm) => {
      // e.preventDefault();

      try{
          await axios.get('http://localhost:8000/promotion/searchPromotion', {
          params: {
            promotionName: searchTerm
          }})
          .then((res) => {
              if(res.data.searchedPromotion.length === 0){
                  setAllPromotion(res.data.searchedPromotion);
              }
              else{
                setAllPromotion(res.data.searchedPromotion);
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
    setPromotionItemName(searchTerm);

    if (searchTerm === '') { // when placeholder empty fetch all data
        setAllPromotion(AllOriginalPromotionItems); // Fetch all data when search term is empty
        // setSearchString("");
    } else {
        await SearchFunction(searchTerm);
        // if(searchString != ''){
        //     setSearchString("");
        // }
    }
};

    const handleFormSubmit = (e) => {
      e.preventDefault();
      SearchFunction(PromotionItemName);
  };

  const logout = (e) => {
    localStorage.clear()
    navigate('/')
}

    return (
        
        <div className = "alldiv">
       
        <div className = "maintablecontainer">
         
         <div className = "tablecontainer">
         <div className="tableHead">
                {/* <h2>Controller</h2> */}

                <div className="search-container">
                    <form className="searchTable" onSubmit={handleFormSubmit}>
                        <input id="searchBar" type="text" value={PromotionItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                        <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                    </form>
                </div>
            </div>
        <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
        {/* <div className="addbtndiv"><Link to='/createform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Item</button></Link></div>   */}
        <div className="tablediv">


        <table class = "table table-striped tbl">
        <thead>
        <tr>
        <th scope="col">No</th>
        <th scope="col">Image</th>
        {/* <th scope="col">PromotionID</th> */}
        <th scope="col">Name</th>
        <th scope="col">Offer Percentage (%)</th>
        <th scope="col">Description</th>
        {/* <th scope="col">Item Pic</th> */}
        {/* <th className="op" scope="col">Operations</th> */}
        </tr>
        </thead>

        {/* <ToastContainer/> */}
      <tbody>
        {allPromotions == null ? "" : allPromotions.map((promotion, index) => (
          <tr key={promotion._id}>
            <th scope="row">{index + 1}</th> 
            <td>
                <img 
                   src={require(`../uploads/${promotion.promotionItempic}`)}
                   width={30}
                   height={40}
                   alt="promotionItemImage" 
                />
            </td>
            {/* <td>{promotion._id}</td> */}
            <td>{promotion.promotionName}</td>
            <td>{promotion.promotionValues}</td>
            <td>{promotion.promotionDescription}</td>
            {/* <td>{promotion.promotionItempic}</td> */}
            {/* <td>
              <table className="EditDeleteBTNs">
              <tbody>
                <tr>
                  <td><Link to={`/updateform/${promotion._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td> &nbsp;
                  <td><button type="button" className="btn btn-danger" onClick={() => handledelete(promotion._id)}>Delete</button></td>
                </tr>
              </tbody>
              </table>
            </td> */}
          </tr>
        ))}
      </tbody>
        
        </table>
        </div>
        </div>
        </div>
        </div>

    )

};
export default AllPromotions2;