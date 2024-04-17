import React, { useEffect,useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

import './ProfitCreateForm.css';

const ProfitUpdateForm = () => {

    const[ PaymentAll, setPaymentAll ] = useState([]);
    const[income,setIncome] = useState('');
    const[salary,setSalary] = useState('');
    const[other,setOther] = useState('');
    const[profit,setProfit] = useState('');



    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getOneProfit = async () => {
            try{

                await axios.get(`http://localhost:8000/profit/getOneProfit/${id}`)
                .then((res) => {
                    setOther(res.data.Profit.other);
                    setIncome(res.data.Profit.income);
                    setProfit(res.data.Profit.profit);
                    console.log("🌟 :: Profit details fetched successfully!");
                    console.log("Profit : ",profit);
                    console.log("Income:",income);

                }).catch((err) => {
                    console.log("💀 :: Error on API URL : "+err.message);
                })

            }catch(err){
                    console.log("💀 :: getOneProfit function failed! ERROR : "+err.message);
            }
        }

        getOneProfit();

        const profit = calculateProfit();
        setProfit(profit);
    
      },[id, other])

      const calculateProfit = () => {
        const profit = income - other - salary;

        return profit;
    }

      const updateData = (e) => {
        e.preventDefault();

        try{
            let updateProfit = {
                income:income,
                other: other,
                profit:profit
            }

            axios.patch(`http://localhost:8000/profit/updateProfit/${id}`,updateProfit)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/getAllProfit')
            })
            .catch((err) => {
                console.log("💀 :: Error on API URL or newProfitData object : "+err.message);
            })
                                                                    
        }catch(err){
            console.log("💀 :: sendData function failed! ERROR : "+err.message);
        }
    }
    


  return (
    <div className="CreateOrderFormContainer" style={{marginRight: "200px"}}>

<div className="orderFormContainer profileFormContainer">
    <h1>Update Profit</h1>

    <form onSubmit={updateData}>
      <div className="profitTotal">
        <p>Total Income: {income} LKR</p>
      </div>
      <div class="form-group mb-3">
        <label for="Other">Other Expenses</label>
        <input type="number" class="form-control" id="other" placeholder="Enter other expenditures" onChange={(e)=>setOther(e.target.value)} value={other} />
      </div>
      <div className="calculateProfitDiv">
        <h2>Profit: <span>{calculateProfit()} LKR</span></h2>
      </div>

      <button type="submit" class="btn btn-primary">Enter</button>

    </form>
</div>

</div>

    
  )
}

export default ProfitUpdateForm;