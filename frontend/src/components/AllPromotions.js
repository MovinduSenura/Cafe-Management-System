import React,{ useState, useEffect } from "react";
import axios from 'axios';
import {Link, useNavigate}from"react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './DataTable.css'


const AllPromotions = ()=> {

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


       const handledelete = async (id) =>{

            try{

              const confirmed  = window.confirm('Are you sure you want to delete this item?');
              
              if(confirmed){
                 await axios.delete(`http://localhost:8000/promotion/deletepromotion/${id}`)
                .then((res) => {
                alert(res.data.message);
                console.log(res.data.message);
               })
               .catch((err) => {
                console.log('☠️ :: Error on API URL : ' +err.message);
               })            
              
       }else {
        toast.warning('Deletion cancelled');
        console.log('Delection cancelled');
       }
      
      }catch(err){
        console.log('☠️ :: handleDelete function failed ! ERROR:'+err.message);
      }
      }

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
      } else {
          await SearchFunction(searchTerm);
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

  //generate Invoice
  const downloadInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:8000/promotion/generate-promotioninvoice"
      );

      const { filepath } = response.data;

      // Create a new <a> element to simulate a download link
      const link = document.createElement("a");
      // Set the href attribute of the link to the filepath of the generated invoice
      link.href = filepath;
      // Set the "download" attribute to specify the default file name for the downloaded file
      link.setAttribute("download", "invoice.pdf");
      // Append the link to the document body
      document.body.appendChild(link);

      // Simulate a click on the link to trigger the download
      link.click();

       // Remove the link from the document body after the download is complete
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error.message);
    }
  };

    return (
        
        <div className = "alldiv">
       
        <div className = "maintablecontainer">

         <div className = "tablecontainer">
         <div className="tableHead">

                <div className="search-container">
                    <form className="searchTable" onSubmit={handleFormSubmit}>
                        <input id="searchBar" type="text" value={PromotionItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                        <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                    </form>
                </div>
            </div>
        <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
        <div className="addbtndiv"><Link to='/createform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Promotion</button></Link></div>  
       
        <button
              type="button"
              className="btn btn-secondary btn-lg ReportBtn"
              onClick={downloadInvoice}
            >
              Download Invoice
        </button>


        
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
        <th className="op" scope="col">Operations</th>
        </tr>
        </thead>

        <ToastContainer/>
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
            <td>{promotion.promotionName} <br/>
              {promotion.isMostUsed && <span className="popularLabel">Most Used</span>}
            </td>
            <td>{promotion.promotionValues}</td>
            <td>{promotion.promotionDescription}</td>
            {/* <td>{promotion.promotionItempic}</td> */}
            <td>
              <table className="EditDeleteBTNs">
              <tbody>
                <tr>
                  <td><Link to={`/updateform/${promotion._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td> &nbsp;
                  <td><button type="button" className="btn btn-danger" onClick={() => handledelete(promotion._id)}>Delete</button></td>
                </tr>
              </tbody>
              </table>
            </td>
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
export default AllPromotions;