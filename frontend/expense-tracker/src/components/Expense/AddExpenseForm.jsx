import React, { useState } from "react";
import Input from "../inputs/input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({onAddExpense}) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  const handleSubmit = () => {
    onAddExpense(expense);
    // Reset form after submission
    setExpense({
      category: "",
      amount: "",
      date: "",
      icon: "",
    });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, Transport, etc"
        type="text"
        required
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
        min="0"
        step="0.01"
        required
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder="Select date"
        type="date"
        required
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
