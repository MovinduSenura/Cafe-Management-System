import React, {useState} from "react";
import axios from 'axios';                           

//importing CSS  files
//import './StaffCreateForm.css'
import './CreateForm.css'

const StaffCreateForm =() =>{

   const [staffName,setstaffName]= useState('');
   const [staffEmail,setstaffEmail]= useState('');
   const [staffContactNo,setstaffContactNo]= useState('');
   const [staffAddress,setstaffAddress]= useState('');
   const [staffAge,setstaffAge]= useState('');
   const [staffGender,setstaffGender]= useState('');
   const [staffSalaryPerHours,setstaffSalaryPerHours]= useState('');
   const [staffWorkedHours,setstaffWorkedHours]= useState('');
   const [staffRole,setstaffRole]=useState('');
   const [staffPassword,setstaffPassword]=useState('');

   const sendData = (e) => {
      e.preventDefault();

      try{

         let newstaff= {
            staffName: staffName,
            staffEmail: staffEmail,
            staffContactNo: staffContactNo,
            staffAddress: staffAddress,
            staffAge:staffAge,
            staffGender:staffGender,
            staffSalaryPerHours: staffSalaryPerHours,
            staffWorkedHours: staffWorkedHours,
            staffPassword:staffPassword,
            staffRole:staffRole,


         }

         axios.post('http://localhost:8000/staff/create', newstaff)
         .then((res) => {
            alert(res.data.message);
            console.log(res.data.status);
            console.log(res.data.message);
         })
         .catch((err) =>{
            console.log("☠️ :: sendData Function failed ERROR : " + err.message);
         })

         //set State back to first state
         setstaffName('');
         setstaffEmail('');
         setstaffContactNo('');
         setstaffAddress('');
         setstaffAge('');
         setstaffGender('');
         setstaffSalaryPerHours('');
         setstaffWorkedHours('');
         setstaffPassword('');
         setstaffRole('');


      }catch(err){
         console.log("☠️ :: sendData Function failed ERROR : "+ err.message);
      }

   }

         
      

      return(
        <div className="createFormContainer">

        <div className="formBootstrap">
            <h2>Registration Form</h2>
            <form onSubmit={sendData}>
                <div className="form-group mb-3">
                   <label for="staffName">Name:</label>
                   <input type="text" className="form-control" autoComplete="off" id="staffName" onChange={(e) => setstaffName(e.target.value)} value={staffName} />
                </div>
                <div className="form-group mb-3">
                <label for="staffEmail">Email:</label>
                   <input type="email" className="form-control" autoComplete="off" id="staffEmail" onChange={(e) => setstaffEmail(e.target.value)} value={staffEmail} />
                </div>


                <div className="form-group mb-3">
                <label htmlFor="password">Password:</label><br />
               <input type="password" id="password" className="form-control" autoComplete="off" name="password"  onChange={(e) => setstaffPassword(e.target.value)} value={staffPassword}  minLength="6" required />
                </div>

                <div className="form-group mb-3">
                <label for="staffContactNo">Contact No:</label>
                   <input type="tel" className="form-control" id="staffContactNo" autoComplete="off" onChange={(e) => setstaffContactNo(e.target.value)} value={staffContactNo} />
                </div>
                <div className="form-group mb-3">
                <label for="staffAddress">Address:</label>
                   <input type="text" className="form-control" id="staffAddress" autoComplete="off" onChange={(e) => setstaffAddress(e.target.value)} value={staffAddress} />
                </div>
                <div className="form-group mb-3">
                <label for="staffAge">Age:</label>
                   <input type="number" className="form-control" id="staffAge" autoComplete="off" min={0}  onChange={(e) => setstaffAge(e.target.value)} value={staffAge}/>
                </div>
                <div className="form-group mb-3">
                <label for="staffGender">Gender:</label>
                   <input type="text" className="form-control" id="staffGender" autoComplete="off"  onChange={(e) => setstaffGender(e.target.value)} value={staffGender}/>
                </div>

                <div className="form-group mb-3">
                <label htmlFor="staffRole">Role:</label><br />
                    <select name="role" className="form-select" id="role" value={staffRole} onChange ={(e) => setstaffRole(e.target.value)} >
                        <option selected>-Select-</option>
                        <option value="admin">Manager</option>
                        <option value="chef">Chef</option>
                        <option value="cashier">Cashier</option>
                    </select>
               </div>  

                <div className="form-group mb-3">
                <label for="staffSalaryPerHours">Salary Per Hours (LKR):</label>
                   <input type="number" className="form-control" id="staffSalaryPerHours" autoComplete="off" min={0} onChange={(e) => setstaffSalaryPerHours(e.target.value)} value={staffSalaryPerHours} />
                </div>
                <div className="form-group mb-3">
                <label for="staffWorkedHours">Worked Hours:</label>
                   <input type="number" className="form-control" id="staffWorkedHours" autoComplete="off" min={0} onChange={(e) => setstaffWorkedHours(e.target.value)} value={staffWorkedHours} />
                </div>
                



         
                <div className="submitbtndiv">
                <button type="submit" class="btn btn-primary submitbtn">Submit</button>
                </div>
            </form>
        </div>
   

   </div>

    )
};
export default StaffCreateForm;




