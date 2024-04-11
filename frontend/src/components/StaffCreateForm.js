import React, {useState} from "react";
import axios from 'axios';                           

//importing CSS  files
import './StaffCreateForm.css'

const StaffCreateForm =() =>{

   const [staffName,setstaffName]= useState('');
   const [staffEmail,setstaffEmail]= useState('');
   const [staffContactNo,setstaffContactNo]= useState('');
   const [staffAddress,setstaffAddress]= useState('');
   const [staffAge,setstaffAge]= useState('');
   const [staffGender,setstaffGender]= useState('');
   const [staffSalaryPerHours,setstaffSalaryPerHours]= useState('');
   const [staffWorkedHours,setstaffWorkedHours]= useState('');
   const [staffRole,setstaffRole]=useState('admin');
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
         setstaffRole('admin');


      }catch(err){
         console.log("☠️ :: sendData Function failed ERROR : "+ err.message);
      }

   }

         
      

      return(
        <div className="staffcreateFormContainer">

        <div className="staffformBootstrap">
            <h1>Registration Form</h1>
            <form onSubmit={sendData}>
                <div className="form-group mb-3">
                   <label for="staffName">Name:</label>
                   <input type="text" className="form-control" id="staffName" onChange={(e) => setstaffName(e.target.value)} value={staffName} />
                </div>
                <div className="form-group mb-3">
                <label for="staffEmail">Email:</label>
                   <input type="text" className="form-control" id="staffEmail" onChange={(e) => setstaffEmail(e.target.value)} value={staffEmail} />
                </div>


                <div className="form-group mb-3">
                <label htmlFor="password">Password</label><br />
               <input type="password" id="password" name="password"  onChange={(e) => setstaffPassword(e.target.value)} value={staffPassword}  minLength="6" required />
                </div>

                <div className="form-group mb-3">
                <label for="staffContactNo">Contact No:</label>
                   <input type="text" className="form-control" id="staffContactNo" onChange={(e) => setstaffContactNo(e.target.value)} value={staffContactNo} />
                </div>
                <div className="form-group mb-3">
                <label for="staffAddress">Address:</label>
                   <input type="text" className="form-control" id="staffAddress" onChange={(e) => setstaffAddress(e.target.value)} value={staffAddress} />
                </div>
                <div className="form-group mb-3">
                <label for="staffAge">Age:</label>
                   <input type="text" className="form-control" id="staffAge"  onChange={(e) => setstaffAge(e.target.value)} value={staffAge}/>
                </div>
                <div className="form-group mb-3">
                <label for="staffGender">Gender:</label>
                   <input type="text" className="form-control" id="staffGender"  onChange={(e) => setstaffGender(e.target.value)} value={staffGender}/>
                </div>

                <div className="form-group mb-3">
                <label htmlFor="staffRole">Role</label><br />
                    <select name="role" id="role" value={staffRole} onChange ={(e) => setstaffRole(e.target.value)} >
                        <option value="admin">Admin</option>
                        <option value="cheff">Chef</option>
                        <option value="cashier">Cashier</option>
                    </select>
               </div>  

                <div className="form-group mb-3">
                <label for="staffSalaryPerHours">Salary Per Hours:</label>
                   <input type="text" className="form-control" id="staffSalaryPerHours" onChange={(e) => setstaffSalaryPerHours(e.target.value)} value={staffSalaryPerHours} />
                </div>
                <div className="form-group mb-3">
                <label for="staffWorkedHours">Worked Hours:</label>
                   <input type="text" className="form-control" id="staffWorkedHours"  onChange={(e) => setstaffWorkedHours(e.target.value)} value={staffWorkedHours} />
                </div>
                



         

                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
       

    </div>

    )
};
export default StaffCreateForm;




