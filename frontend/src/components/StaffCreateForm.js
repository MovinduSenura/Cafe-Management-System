import React, { useState } from "react";
import axios from 'axios';                           
import './CreateForm.css';

const StaffCreateForm = () => {
    const [staffName, setStaffName] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffContactNo, setStaffContactNo] = useState('');
    const [staffAddress, setStaffAddress] = useState('');
    const [staffAge, setStaffAge] = useState('');
    const [staffGender, setStaffGender] = useState('');
    const [staffSalaryPerHours, setStaffSalaryPerHours] = useState('');
    const [staffWorkedHours, setStaffWorkedHours] = useState('');
    const [staffRole, setStaffRole] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [error, setError] = useState('');

    const sendData = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let newStaff = {
            staffName: staffName,
            staffEmail: staffEmail,
            staffContactNo: staffContactNo,
            staffAddress: staffAddress,
            staffAge: staffAge,
            staffGender: staffGender,
            staffSalaryPerHours: staffSalaryPerHours,
            staffWorkedHours: staffWorkedHours,
            staffPassword: staffPassword,
            staffRole: staffRole,
        };

        axios.post('http://localhost:8000/staff/create', newStaff)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
            })
            .catch((err) => {
                console.log("☠️ :: sendData Function failed ERROR : " + err.message);
            });

        resetForm();
    };

   //  const validateForm = () => {
   //      if (!staffName || !staffEmail || !staffContactNo || !staffAddress || !staffAge || !staffGender || !staffSalaryPerHours || !staffWorkedHours || !staffRole || !staffPassword) {
   //          setError('All fields are required.');
   //          return false;
   //      }

   //      if (!isValidEmail(staffEmail)) {
   //          setError('Please enter a valid email address.');
   //          return false;
   //      }

   //      return true;
   //  };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
      if (!staffName.trim()) {
          setError('Name field is required.');
          return false;
      }
  
      if (!staffEmail.trim()) {
          setError('Email field is required.');
          return false;
      } else if (!isValidEmail(staffEmail)) {
          setError('Please enter a valid email address.');
          return false;
      }
  
      if (!staffPassword.trim()) {
          setError('Password field is required.');
          return false;
      } else if (staffPassword.length < 6) {
          setError('Password must be at least 6 characters long.');
          return false;
      }
  
      if (!staffContactNo.trim()) {
          setError('Contact No field is required.');
          return false;
      }
  
      if (!staffAddress.trim()) {
          setError('Address field is required.');
          return false;
      }
  
      if (!staffAge) {
          setError('Age field is required.');
          return false;
      } else if (staffAge < 18) {
          setError('Age must be at least 18 years.');
          return false;
      }
  
      if (!staffGender.trim()) {
          setError('Gender field is required.');
          return false;
      }
  
      if (!staffRole.trim()) {
          setError('Role field is required.');
          return false;
      }
  
      if (!staffSalaryPerHours) {
          setError('Salary Per Hours field is required.');
          return false;
      } else if (staffSalaryPerHours < 0) {
          setError('Salary Per Hours must be a positive number.');
          return false;
      }
  
      if (!staffWorkedHours) {
          setError('Worked Hours field is required.');
          return false;
      } else if (staffWorkedHours < 0) {
          setError('Worked Hours must be a positive number.');
          return false;
      }
  
      // If all validations pass, return true
      return true;
  };
  

    const resetForm = () => {
        setStaffName('');
        setStaffEmail('');
        setStaffContactNo('');
        setStaffAddress('');
        setStaffAge('');
        setStaffGender('');
        setStaffSalaryPerHours('');
        setStaffWorkedHours('');
        setStaffPassword('');
        setStaffRole('');
        setError('');
    };

    return (
        <div className="createFormContainer">
            <div className="formBootstrap">
                <h2>Registration Form</h2>
                {error && <p className="error" style={{color:'red',marginTop:"20px"}}>{error}</p>}
                <form onSubmit={sendData}>
                    <div className="form-group mb-3">
                        <label htmlFor="staffName">Name:</label>
                        <input type="text" className="form-control" autoComplete="off" id="staffName" onChange={(e) => setStaffName(e.target.value)} value={staffName} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffEmail">Email:</label>
                        <input type="email" className="form-control" autoComplete="off" id="staffEmail" onChange={(e) => setStaffEmail(e.target.value)} value={staffEmail} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password:</label><br />
                        <input type="password" id="password" className="form-control" autoComplete="off" name="password" onChange={(e) => setStaffPassword(e.target.value)} value={staffPassword} minLength="6" required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffContactNo">Contact No:</label>
                        <input type="tel" className="form-control" id="staffContactNo" autoComplete="off" onChange={(e) => setStaffContactNo(e.target.value)} value={staffContactNo} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffAddress">Address:</label>
                        <input type="text" className="form-control" id="staffAddress" autoComplete="off" onChange={(e) => setStaffAddress(e.target.value)} value={staffAddress} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffAge">Age:</label>
                        <input type="number" className="form-control" id="staffAge" autoComplete="off" min={0} onChange={(e) => setStaffAge(e.target.value)} value={staffAge} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffGender">Gender:</label>
                        <input type="text" className="form-control" id="staffGender" autoComplete="off" onChange={(e) => setStaffGender(e.target.value)} value={staffGender} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffRole">Role:</label><br />
                        <select name="role" className="form-select" id="role" value={staffRole} onChange={(e) => setStaffRole(e.target.value)}>
                            <option value="">-Select-</option>
                            <option value="admin">Manager</option>
                            <option value="chef">Chef</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffSalaryPerHours">Salary Per Hours (LKR):</label>
                        <input type="number" className="form-control" id="staffSalaryPerHours" autoComplete="off" min={0} onChange={(e) => setStaffSalaryPerHours(e.target.value)} value={staffSalaryPerHours} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="staffWorkedHours">Worked Hours:</label>
                        <input type="number" className="form-control" id="staffWorkedHours" autoComplete="off" min={0} onChange={(e) => setStaffWorkedHours(e.target.value)} value={staffWorkedHours} />
                    </div>
                    <div className="submitbtndiv">
                        <button type="submit" className="btn btn-primary submitbtn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffCreateForm;
