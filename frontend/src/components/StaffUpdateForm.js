import React, {useState,useEffect} from "react";
import axios from 'axios';  
import { useParams, useNavigate } from "react-router-dom";                         

//importing CSS  files
//import './StaffCreateForm.css'
import './UpdateForm.css'

const StaffUpdateForm =() =>{

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


   //using useParams we catching id from URL and assign it to id const
   const { id } = useParams();
   const navigate = useNavigate();

   useEffect(() => {

       const getOneData = async () => {
           try{

               await axios.get(`http://localhost:8000/staff/staff/${id}`)
               .then((res) => {
                   setstaffName(res.data.Staff.staffName);
                   setstaffEmail(res.data.Staff.staffEmail);
                   setstaffContactNo(res.data.Staff.staffContactNo);
                   setstaffAddress(res.data.Staff.staffAddress);
                   setstaffAge(res.data.Staff.staffAge);
                   setstaffGender(res.data.Staff.staffGender);
                   setstaffSalaryPerHours(res.data.Staff.staffSalaryPerHours);
                   setstaffWorkedHours(res.data.Staff.staffWorkedHours);
                   setstaffRole(res.data.Staff.staffRole);
                   setstaffPassword(res.data.Staff.staffPassword);
                   
                   console.log("✨ :: Item fetched successfully!");
               })
               .catch((err) => {
                   console.log("☠️ :: Error on API URL : " + err.message);
               })

           }catch (err){
               console.log("☠️ :: getOneData function failed! ERROR : " + err.message);
           }
       }

       getOneData();

   }, [id])



   const updateData = (e) => {
      e.preventDefault();

      try{

         let updateStaffData= {
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

         axios.patch(`http://localhost:8000/staff/staffupdate/${id}`, updateStaffData)
         .then((res) => {
            alert(res.data.message);
            console.log(res.data.status);
            console.log(res.data.message);
            navigate('/allstaff');
         })
         .catch((err) =>{
            console.log("☠️ :: Error on API URL or updateStaffData object : " + err.message);
         })

         //clear form fields after successful submission(fields in form are empty) 
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
        <div className="updateFormContainer">

        <div className="updateformBootstrap">
            <h1>Update Form</h1>
            <form onSubmit={updateData}>
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
                



         
                <div className="updatebtndiv">
                <button type="submit" class="btn btn-primary submitbtn">Update</button>
                </div>
            </form>
        </div>
       

    </div>

    );
};
export default StaffUpdateForm;




