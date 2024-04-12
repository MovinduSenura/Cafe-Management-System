// import { jwtDecode } from "jwt-decode";
// const { useNavigate } = require('react-router-dom');
// const axios = require('axios');
// const React = require("react");
// const { useState } = require("react");

// const StaffLogin = () => {
//     const [formData, setFormData] = useState({
//         staffEmail: '',
//         staffPassword: ''
//     });

//     const [error, setError] = useState('');
//     const navigate = useNavigate();


//     const { staffEmail, staffPassword } = formData;

//     const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const onSubmit = async e => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('http://localhost:8000/staff/StaffLogin', { staffEmail, staffPassword });
//             const token = res.data.token;
//             localStorage.setItem('token', token);
    
//             // Decode JWT token to get user's role
//             const decodedToken = jwtDecode(token);
//             const staffRole = decodedToken.staff.staffRole;
    
//             // Redirect based on user's role
//             if (staffRole === 'admin') {
//                 navigate('/admin');
//             } else if (staffRole === 'cheff') {
//                 navigate('/cheff');
//             } else {
//                 navigate('/cashier');
//             }
//         } catch (err) {
//             console.log("☠ :: onSubmit Function failed ERROR : ", err);
//             setError(err.response.data.msg || 'An error occurred');
//         }
//     };

//     return (
//         // <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
//             <div style={{textAlign:'center',maxWidth:'400px',margin:'0 auto'}}>
//             <h2>StaffLogin</h2>
//             <form onSubmit={onSubmit}>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label htmlFor="staffEmail">staffEmail</label><br />
//                     <input type="text" id="staffEmail" name="staffEmail" value={staffEmail} onChange={onChange} style={{ width: '100%', padding: '0.5rem' }} required />
//                 </div>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label htmlFor="staffPassword">staffPassword</label><br />
//                     <input type="password" id="staffPassword" name="staffPassword" value={staffPassword} onChange={onChange} style={{ width: '100%', padding: '0.5rem' }} required />
//                 </div>
//                 <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}>StaffLogin</button>
//                 {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
//             </form>
//         </div>
//     );
// };

// module.exports = StaffLogin;

// const jwtDecode = require("jwt-decode");
// const { useState } = require("react");
// const { useNavigate } = require('react-router-dom');
// // const axios = require('axios');
// import axios from 'axios'

import {jwtDecode} from "jwt-decode";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffLogin = () => {
    const [formData, setFormData] = useState({
        staffEmail: '',
        staffPassword: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { staffEmail, staffPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
         e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/staff/StaffLogin', { staffEmail, staffPassword });
            const token = res.data.token;
            localStorage.setItem('token', token);
    
            // // Decode JWT token to get user's role
             const decodedToken = jwtDecode(token);
            const staffRole = res.data.staffRole;
    
            // Redirect based on user's role
            if (staffRole === 'admin') {
                navigate('/admin');
            } else if (staffRole === 'chef') {
                navigate('/chef');
            } else {
                navigate('/cashier');
            }
        } catch (err) {
            console.log("☠ :: onSubmit Function failed ERROR : ", err);
            if(err.response){
                setError(err.response.data.msg || 'An error occurred');

            }else{
                setError('error on login onsubmit function'+err.message);
            }
            
        }
    };

    return (
        <div>
            <h2>StaffLogin</h2>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="staffEmail">staffEmail</label><br />
                    <input type="text" id="staffEmail" name="staffEmail" value={staffEmail} onChange={onChange} style={{ width: '100%', padding: '0.5rem' }} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="staffPassword">staffPassword</label><br />
                    <input type="password" id="staffPassword" name="staffPassword" value={staffPassword} onChange={onChange} style={{ width: '100%', padding: '0.5rem' }} required />
                </div>
                <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}>StaffLogin</button>
                {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
            </form>
        </div>
    );
};

export default StaffLogin;
