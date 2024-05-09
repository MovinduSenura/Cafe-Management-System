import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

import './ProfitCreateForm.css';

const ProfitUpdateForm = () => {
    const [income, setIncome] = useState('');
    const [salary, setSalary] = useState('');
    const [other, setOther] = useState('');
    const [profit, setProfit] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getOneProfit = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/profit/getOneProfit/${id}`);
                const { income,salary,other,profit } = res.data.Profit;
                setIncome(income);
                setSalary(salary);
                setOther(other);
                setProfit(profit);
                
                console.log("🌟 :: Profit details fetched successfully!");
            } catch (err) {
                console.log("💀 :: Error fetching profit details: " + err.message);
            }
        }

        getOneProfit();
    }, [id]);

    useEffect(() => {
        const calculatedProfit = calculateProfit(income, other, salary);
        setProfit(calculatedProfit);
    }, [income, other, salary]);

    const calculateProfit = (income, other, salary) => {
        return income - other - salary;
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

    const updateData = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const updatedProfit = {
                income: income,
                salary: salary,
                other: other,
                profit: profit
            }

            const res = await axios.patch(`http://localhost:8000/profit/updateProfit/${id}`, updatedProfit);
            alert(res.data.message);
            console.log(res.data.status);
            console.log(res.data.message);
            navigate('/getAllProfit');
        } catch (err) {
            console.log("💀 :: Error updating profit: " + err.message);
        }
    }

    return (
        <div className="CreateOrderFormContainer" style={{ marginRight: "200px" }}>
            <div className="orderFormContainer profileFormContainer">
                <h1>Update Profit</h1>
                <form onSubmit={updateData}>
                    <div className="profitTotal">
                        <p>Total Income: {income} LKR</p>
                    </div>
                    <div className="profitSalary">
                        <p>Salary: {salary} LKR</p>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="other">Other Expenses</label>
                        <input type="number" className="form-control" id="other" placeholder="Enter other expenditures" onChange={(e) => setOther(parseFloat(e.target.value) || '')} value={other === '' ? '' : parseFloat(other)} />
                    </div>
                    <div className="calculateProfitDiv">
                        <h2>Profit: <span>{profit} LKR</span></h2>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">Enter</button>
                </form>
            </div>
        </div>
    )
}

export default ProfitUpdateForm;
