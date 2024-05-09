import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

//import CSS files
import './DataTable.css'

//getAll
export const PaymentAll = () => {

    const [PaymentAll, setPaymentAll] = useState([]);
    const [allOriginalPayments, setallOriginalPayments] = useState([]);
    const [orderID, setorderID] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const getAllPayments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/404'); // Redirect to 404 page if token is not present
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/payment/getAllPayment');
                setPaymentAll(res.data.allPayments);
                setallOriginalPayments(res.data.allPayments);
                console.log(res.data.message);
                console.log('status : ' + res.data.status);
            } catch (err) {
                console.log("💀 :: Error on API URL! ERROR : ", err.message);
            }
        }

        getAllPayments();

    }, [navigate])

    //delete
    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this payment record?');
            if (confirmed) {
                const res = await axios.delete(`http://localhost:8000/payment/deletePayment/${id}`);
                toast.success(res.data.message); // Display success message
                const updatedPayments = PaymentAll.filter(payment => payment._id !== id);
                setPaymentAll(updatedPayments);
            } else {
                toast.warning('Deletion cancelled!');
                console.log('Deletion cancelled');
            }
        } catch (err) {
            console.log('💀 :: Error on API URL : ' + err.message);
        }
    }

    //search functions
    const SearchFunction = async (searchTerm) => {
        try {
            const res = await axios.get('http://localhost:8000/payment/searchPayment', {
                params: {
                    orderID: searchTerm
                }
            });
            if (res.data.searchPayment.length === 0) {
                setPaymentAll(res.data.searchPayment);
            } else {
                setPaymentAll(res.data.searchPayment);
                console.log(res.data.message);
            }
        } catch (error) {
            console.log("☠️ :: Error on response from server! ERROR : ", error.message);
        }
    }

    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setorderID(searchTerm);
        if (searchTerm === '') {
            setPaymentAll(allOriginalPayments);
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!orderID.trim()) {
            toast.error('Please enter a valid Order ID'); // Display error message for empty Order ID
            return;
        }
        SearchFunction(orderID);
    };

    // Function to calculate total payment amount
    const calculateTotal = () => {
        let total = 0;
        PaymentAll.forEach(payment => {
            total += payment.amount;
        });
        return total;
    }

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }

    //generate Invoice
    const downloadInvoice = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                "http://localhost:8000/payment/payment-generate-invoice"
            );
            const { filepath } = response.data;
            const link = document.createElement("a");
            link.href = filepath;
            link.setAttribute("download", "invoice.pdf");
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading invoice:", error.message);
        }
    };

    return (
        <div className='alldiv'>
            <div className='maintablecontainer'>
                <div className="tableHead">
                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={orderID} onChange={handleSearchChange} placeholder="Search.." name="search" />
                            <button type="submit"><i className="fa fa-search" style={{ color: "#ffffff", }}></i></button>
                        </form>
                    </div>
                </div>
                <div className="tablecontainer">
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg ReportBtn"
                        onClick={downloadInvoice}
                    >
                        Download Invoice
                    </button>
                    <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
                    <div className="tablediv">
                        <ToastContainer />
                        <table className="table table-striped tbl">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">OrderID</th>
                                    <th scope="col">PromotionID</th>
                                    <th scope="col">Amount (LKR)</th>
                                    <th scope="col">Date</th>
                                    <th scope="col" className='op'>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PaymentAll.map((payments, index) => (
                                    <tr key={payments._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{payments.orderID}</td>
                                        <td>{payments.promotionID}</td>
                                        <td>{payments.amount}</td>
                                        <td>{moment(payments.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>
                                            <table className='EditDeleteBTNs'>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <button type="button" className="btn btn-danger" onClick={() => handleDelete(payments._id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <p>Total: <h3>{calculateTotal()} LKR</h3></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PaymentAll;
