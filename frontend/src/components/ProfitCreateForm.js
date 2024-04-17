import React, { useEffect,useState } from "react";
import axios from 'axios';




const ProfitCreateForm = () => {

    const[ PaymentAll, setPaymentAll ] = useState([]);
    const[income,setIncome] = useState('');
    const[salary,setSalary] = useState(100);
    const[other,setOther] = useState('');
    const[profit,setProfit] = useState('');
    

    useEffect(() => {
        const getAllPayments = async () => {
    
          try{
            await axios.get('http://localhost:8000/payment/getAllPayment')
            .then((res) => {
              setPaymentAll(res.data.allPayments);
              console.log(res.data.message);
              console.log('status : '+res.data.status);
            }).catch((err) => {
              console.log("💀 :: Error on API URL! ERROR : ",err.message);
            })
          }catch(err){
            console.log("💀 :: getAllPayments function failed!"+err.message);
          }
        }
    
        const totalIncome = calculateTotal();
        setIncome(totalIncome);

        const profit = calculateProfit();
        setProfit(profit);

        getAllPayments();
    
      },[other])

    const sendData = (e) => {
        e.preventDefault();
    
        try {

            let newProfitData = {
                income: income,
                // salary: salary,
                other:other,
                profit:profit
            }

            console.log("income : ",income)
            console.log("other : ",other)
            console.log("profit : ",profit)
    
            axios.post('http://localhost:8000/profit/createProfit', newProfitData)
                .then((res) => {
                    alert(res.data.message);
                    console.log(res.data.status);
                    console.log(res.data.message);
                    window.location.href=`/getAllProfit`;
                })
                .catch((err) => {
                    console.log("💀 :: Error on api url or CreateProfitForm object : " + err.message);
                })
    
            // Set state back to initial values
           
    
        } catch (error) {
            console.log("💀 :: Error on axios request: " + error.message);
        }
    }

    const calculateTotal = () => {
        let total = 0;
      
        // Iterate through each payment and sum up the amount
        PaymentAll.forEach(payment => {
            total += payment.amount;
        });
      
        return total;
      }

      const calculateProfit = () => {
        const totalIncome = calculateTotal();
        const profit = totalIncome - other - salary;

        return profit;
      }


  return (
    <div className="CreateOrderFormContainer">

        <div className="orderFormContainer">
            <h1>Add Profit</h1>
            
        

    <form onSubmit={sendData}>
            <h2>total : {calculateTotal()}</h2>
            <h2>Salary : {salary}</h2>
            <h2>profit : {calculateProfit()}</h2>
        {/* <div className="form-group mb-3">
                    <label for="date">Date: </label>
                    <input type="date" className="form-control" id="date" onChange={
                            (e) => {
                                setDate(e.target.value) 
                            }
                            } value={date}/>
        </div> */}
        <div class="form-group mb-3">
            <label for="Other">Other</label>
                <input type="number" class="form-control" id="other" placeholder="Enter other expenditures" onChange={(e)=>setOther(e.target.value)} value={other} />
        </div>

        <button type="submit" class="btn btn-primary">Enter</button>
    </form>

    </div>
    </div>

    
  )
}

export default ProfitCreateForm