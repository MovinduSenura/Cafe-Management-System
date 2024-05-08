import React, { useEffect, useState } from "react";
import axios from 'axios';

import './ProfitCreateForm.css';

const ProfitCreateForm = () => {
    const [PaymentAll, setPaymentAll] = useState([]);
    const [income, setIncome] = useState('');
    const [salary, setSalary] = useState();
    const [other, setOther] = useState('');
    const [profit, setProfit] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const getAllPayments = async () => {
            try {
                const res = await axios.get('http://localhost:8000/payment/getAllPayment');
                setPaymentAll(res.data.allPayments);
                console.log(res.data.message);
                console.log('status : ' + res.data.status);
            } catch (err) {
                console.log("💀 :: Error on API URL! ERROR : ", err.message);
            }
        }

        const calculateStaffSalary = async () => {
            try {
                const res = await axios.get('http://localhost:8000/staff/staff');
                const staffData = res.data.AllStaff; // Access the AllStaff property
                let totalSalary = 0;
                staffData.forEach(staff => {
                    totalSalary += staff.staffSalaryPerHours * staff.staffWorkedHours;
                });
                setSalary(totalSalary); // Update the salary state
            } catch (err) {
                console.log("💀 :: Error fetching staff data! ERROR : ", err.message);
            }
        }

        const totalIncome = calculateTotal();
        setIncome(totalIncome);

        const profit = calculateProfit();
        setProfit(profit);

        getAllPayments();
        calculateStaffSalary();
    }, [other]);

    const sendData = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            let newProfitData = {
                income: income,
                salary:salary,
                other: other,
                profit: profit
            }

            axios.post('http://localhost:8000/profit/createProfit', newProfitData)
                .then((res) => {
                    alert(res.data.message);
                    console.log(res.data.status);
                    console.log(res.data.message);
                    window.location.href = `/getAllProfit`;
                })
                .catch((err) => {
                    console.log("💀 :: Error on api url or CreateProfitForm object : " + err.message);
                })

        } catch (error) {
            console.log("💀 :: Error on axios request: " + error.message);
        }
    }

    const validateForm = () => {
        let isValid = true;
        setError('');

        if (isNaN(other) || other < 0) {
            setError('Other Expenses must be a positive number.');
            isValid = false;
        }

        return isValid;
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
            <div className="orderFormContainer profileFormContainer">
                <h1>Add Profit</h1>

                <form onSubmit={sendData}>
                    <div className="profitTotal">
                        <p>Total Income: {calculateTotal()} LKR</p>
                    </div>
                    <div className="profitSalary">
                        <p>Salary: {salary} LKR</p>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="other">Other Expenses</label>
                        <input type="number" className="form-control" id="other" placeholder="Enter other expenditures" min={0} onChange={(e) => setOther(e.target.value)} value={other} />
                    </div>
                    <div className="calculateProfitDiv">
                        <h2>Profit: <span>{calculateProfit()} LKR</span></h2>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">Enter</button>
                </form>
            </div>
        </div>
    )
}

export default ProfitCreateForm;
