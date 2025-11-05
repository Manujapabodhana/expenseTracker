const User = require('../models/User');
const Income = require('../models/Income');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

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
        res.json(income);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }
}

//DELETE INCOME source
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found', status: 'fail' });
        }
        res.json({ message: 'Income deleted successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: 'fail' });
    }
};

//DOWNLOAD INCOME EXCEL source
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        if (!incomes || incomes.length === 0) {
            return res.status(404).json({ 
                message: 'No income data found', 
                status: 'fail' 
            });
        }

        // Prepare data for Excel with better formatting
        const data = incomes.map((item, index) => ({
            'S.No': index + 1,
            'Source': item.source,
            'Amount ($)': item.amount,
            'Date': new Date(item.date).toLocaleDateString('en-US'),
            'Icon': item.icon || '💰',
            'Created At': new Date(item.createdAt).toLocaleDateString('en-US')
        }));

        // Add summary row
        const totalAmount = incomes.reduce((sum, item) => sum + item.amount, 0);
        data.push({
            'S.No': '',
            'Source': 'TOTAL',
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
            { width: 20 }, // Source
            { width: 15 }, // Amount
            { width: 15 }, // Date
            { width: 10 }, // Icon
            { width: 15 }  // Created At
        ];

        // Append worksheet to workbook
        xlsx.utils.book_append_sheet(wb, ws, "Income Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `income_report_${timestamp}.xlsx`;
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