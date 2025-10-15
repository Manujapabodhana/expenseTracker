const User = require('../models/User');
const Expense = require('../models/Expense');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

//ADD EXPENSE source
exports.addExpense = async (req, res) => {

    const userId = req.user.id;

    try{
        const { category, amount, date, description } = req.body;

        //validation check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({ message: 'Please provide category, amount, and date', status: 'fail' });
        }

        const newExpense = new Expense({
            userId,
            category,
            amount,
            description,
            date: new Date(date)
        });

        await newExpense.save();

        return res.status(201).json({ message: 'Expense added successfully', status: 'success', data: newExpense });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }

}

//GET EXPENSES source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json({ status: 'success', data: expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }
}

//DELETE EXPENSE source
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found', status: 'fail' });
        }
        res.json({ message: 'Expense deleted successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }
};

//DOWNLOAD EXPENSE EXCEL source
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({
                message: 'No expense data found',
                status: 'fail'
            });
        }

        // Prepare data for Excel with better formatting
        const data = expenses.map((item, index) => ({
            'S.No': index + 1,
            'Category': item.category,
            'Amount ($)': item.amount,
            'Date': new Date(item.date).toLocaleDateString('en-US'),
            'Icon': item.icon || '💰',
            'Created At': new Date(item.createdAt).toLocaleDateString('en-US')
        }));

        // Add summary row
        const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
        data.push({
            'S.No': '',
            'Category': 'TOTAL',
            'Amount ($)': totalAmount,
            'Date': '',
            'Icon': '',
            'Created At': ''
        });

        // Create workbook and worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        // Set column widths
        ws['!cols'] = [
            { width: 10 }, // S.No
            { width: 20 }, // Category
            { width: 15 }, // Amount
            { width: 15 }, // Date
            { width: 10 }, // Icon
            { width: 15 }  // Created At
        ];

        // Append worksheet to workbook
        xlsx.utils.book_append_sheet(wb, ws, "Expense Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `expense_report_${timestamp}.xlsx`;
        const filepath = path.join(__dirname, '..', 'temp', filename);

        // Create temp directory if it doesn't exist
        const tempDir = path.dirname(filepath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Write file to temp directory
        xlsx.writeFile(wb, filepath);

        // Set proper headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Send file for download
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ message: 'Error downloading file', status: 'fail' });
            } else {
                // Clean up: delete temporary file after successful download
                setTimeout(() => {
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                        console.log('Temporary file deleted:', filename);
                    }
                }, 5000); // Delete after 5 seconds
            }
        });
        
    } catch (error) {
        console.error('Excel download error:', error);
        res.status(500).json({ 
            message: 'Error generating Excel file', 
            error: error.message,
            status: 'fail' 
        });
    }
};