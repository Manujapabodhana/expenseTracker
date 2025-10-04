const User = require('../models/User');
const Income = require('../models/Income');

//ADD INCOME source
exports.addIncome = async (req, res) => {

    const userId = req.user.id;

    try{
        const { icon, source, amount, date } = req.body;

        //validation check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({ message: 'Please provide source, amount, and date', status: 'fail' });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();

        return res.status(201).json({ message: 'Income added successfully', status: 'success', data: newIncome });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }

}

//GET INCOMES source
exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json({ income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }
}

//DELETE INCOME source
exports.deleteIncome = async (req, res) => {}   

//DOWNLOAD INCOME EXCEL source
exports.downloadIncomeExcel = async (req, res) => {}