import axios from "axios";
import React, { useEffect, useState } from "react";
import './CustomerAll.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

//toast=assign a message ToastContainer = call the set message

const AllCustomers = () => {

    //Here allCustomers means all the details of customrs.(name,address,email like) So usestate is used as an empty array([]) not as a string(" ")
    const [allCustomers, setAllCustomers] = useState([]);
    const [customerNIC, setCustomerNIC] = useState ("");
    //get table after emptying search. search krddi setAllCustomers ekt serachCustomer assign wena nisa mhema ekk gnnw aye allCustomers gnna.
    const [allOriginalCustomers, setAllOriginalCustomers] = useState ([]);

    //useEffect is a arrow function.It runs first when running a component
    useEffect(() => {

        //function used to get data.
        const getAllCustomers = async () => {
            //axios used to send request to backend
            //Here data is not sent.only taken.request is not used in controller backend in readall part. so here only one parameter is used.
            //in get method only one parameter is used.

            try {

                await axios.get('http://localhost:8000/customer/customers')

                    //controller eken Allcustomers ewnw..eeka allgnnonii.Array ekk wdyt enne
                    .then((res) => {
                        setAllCustomers(res.data.Allcustomers);
                        //assign al table data to setAllOriginalCustomers too
                        setAllOriginalCustomers(res.data.Allcustomers);
                        console.log(res.data.message);
                    })
                    .catch((err) => {
                        console.log("❌ :: Error on API URL ERROR : ", err.message);
                    })

            } catch (err) {
                console.log("❌ :: getAllCustomers failed ERROR : " + err.message);
            }


        }

        getAllCustomers();
        //useEffect eka mulinma methna cal krpu ekt awilla eetapsse ethnin thmai implementation eka run wenne.
    }, [])   //empty array([])= no.of times the useEffect runs.
    //2 arguments in useEffect - 1. arrow function  2.empty array

    //Delete
    const handleDelete = async (id) => {
        //customers._id(in delete button) parameter is passed to id above   
        try {

            const confirmed = window.confirm("Are you want to delete this customer??");

            if (confirmed) {

                //when passing a parameter or variable bactic mark is used
                await axios.delete(`http://localhost:8000/customer/customerdelete/${id}`)
                    .then((res) => {
                        alert(res.data.message);
                        console.log(res.data.message);
                    })
                    .catch((err) => {
                        console.log("❌ :: Error on API URL : " + err.message);
                    })


            } else {
                toast.error('Deletion Cancelled!', {
                    position: "top-center",
                });
                console.log("Deletion Cancelled!")
            }




        } catch (err) {
            console.log("❌ :: handleDelete function failed! ERROR : " + err.message);
        }



    }

    //searchCustomer
    //SearchFunction eka cal krddi async ekt ehptte eka replace wenw.
    const SearchFunction = async (searchTerm) => {
        // e.preventDefault();

        try{
            await axios.get('http://localhost:8000/customer/customersearch', {
            params: {
                customerNIC: searchTerm
                //here customerNIC is taken from searchCustomer eke try eke res.query.customerNIC  in controller.js
            }})
            .then((res) => {
                //customerSearch coming from controller
                //if = data awe nattm else ekt ynw
                //data awot match wena ekk nttm table eka empty wenw.waguwa =0
                if(res.data.customerSearch.length === 0){
                    setAllCustomers(res.data.customerSearch);
                }
                else{
                    setAllCustomers(res.data.customerSearch);
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

    //handleSearchChange = onchange
    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;//klin written inside onchange. input krna akurak pasa ynw
        setCustomerNIC(searchTerm);
        //methn thynne uda 123 hdgtt const searchTerm eka


        //meka nisa thmai serach krpu eka clear klma ayemat mulin thbba table ekm enne
        if (searchTerm === '') { // when placeholder empty fetch all data
            setAllCustomers(allOriginalCustomers); // Fetch all data when search term is empty
            //phla map krla thynne allCustomers walata nisa thma allOriginalCustomers ekt samana kle.
        } else {
            await SearchFunction(searchTerm);
            // if(searchString != ''){
            //     setSearchString("");
            // }
        }
    };

    //search with button
    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(customerNIC);
    };



    return (
        <div className="CustomerAllContainer">

            <div className="tableContainer">
                <center><h3 className="mt-3">Loyalty Customers</h3></center>

                <div className="tableHead">
                    <h2>Controller</h2>

                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={customerNIC} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>


                <div>
                    <a href="/customerCreate">
                        <button type="button" className="btn btn-secondary AddItemBtn">Add New Customer</button>
                    </a>
                </div>

                {/* can put in anyplace within main div */}
                <ToastContainer />

                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">NIC</th>
                            <th scope='col'>Email</th>
                            <th scope="col">Loyalty Points</th>
                            <th scope="col">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCustomers == null ? "" : allCustomers.map((customers, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{customers.customerFullName}</td>
                                <td>{customers.customerNIC}</td>
                                <td>{customers.customerEmail}</td>
                                <td>{customers.customerLoyaltyPoints}</td>
                                {/* a href = Link to , a = Link, href = to */}
                                <td><Link to={`/CustomerView/${customers._id}`}><button type="button" className="btn btn-warning">View</button></Link>&nbsp;&nbsp;
                                    </td>

                            </tr>

                        ))}

                    </tbody>
                </table>
            </div>



        </div>
    )
};

export default AllCustomers;