 const express = require('express');
 const { 
    addIncome, 
    getIncomes, 
    updateIncome, 
    deleteIncomeExcel

 } = require('../controllers/incomeController');
 const { protect } = require('../middleware/authMiddleware');

 const router = express.Router();

 router.post("/add", protect, addIncome);
 router.get("/get", protect, getIncomes);
 router.put("/update/:id", protect, updateIncome);
 router.delete("/delete/:id", protect, deleteIncomeExcel);