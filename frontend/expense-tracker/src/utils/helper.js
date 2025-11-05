import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^@]+@[^@]+\.[^@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  // Group expenses by date and sum amounts for the same date
  const groupedByDate = {};
  
  data.forEach((item) => {
    const dateKey = moment(item?.date).format('Do MMM');
    if (groupedByDate[dateKey]) {
      groupedByDate[dateKey] += Number(item?.amount || 0);
    } else {
      groupedByDate[dateKey] = Number(item?.amount || 0);
    }
  });

  // Convert to array and sort by date
  const chartData = Object.entries(groupedByDate)
    .map(([date, amount]) => ({
      category: date,
      amount: amount,
    }))
    .sort((a, b) => {
      const dateA = moment(a.category, 'Do MMM');
      const dateB = moment(b.category, 'Do MMM');
      return dateA - dateB;
    });

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  // Group income by date and sum amounts for the same date
  const groupedByDate = {};
  
  data.forEach((item) => {
    const dateKey = moment(item?.date).format('Do MMM');
    if (groupedByDate[dateKey]) {
      groupedByDate[dateKey] += Number(item?.amount || 0);
    } else {
      groupedByDate[dateKey] = Number(item?.amount || 0);
    }
  });

  // Convert to array and sort by date
  const chartData = Object.entries(groupedByDate)
    .map(([date, amount]) => ({
      category: date,
      amount: amount,
    }))
    .sort((a, b) => {
      const dateA = moment(a.category, 'Do MMM');
      const dateB = moment(b.category, 'Do MMM');
      return dateA - dateB;
    });

  return chartData;
};

export const prepareExpenseByCategoryData = (data = []) => {
  // Group expenses by category and sum amounts
  const groupedByCategory = {};
  
  data.forEach((item) => {
    const category = item?.category || 'Unknown';
    if (groupedByCategory[category]) {
      groupedByCategory[category] += Number(item?.amount || 0);
    } else {
      groupedByCategory[category] = Number(item?.amount || 0);
    }
  });

  // Convert to array
  const chartData = Object.entries(groupedByCategory).map(([category, amount]) => ({
    category: category,
    amount: amount,
  }));

  return chartData;
};

export const prepareIncomeBySourceData = (data = []) => {
  // Group income by source and sum amounts
  const groupedBySource = {};
  
  data.forEach((item) => {
    const source = item?.source || 'Unknown';
    if (groupedBySource[source]) {
      groupedBySource[source] += Number(item?.amount || 0);
    } else {
      groupedBySource[source] = Number(item?.amount || 0);
    }
  });

  // Convert to array
  const chartData = Object.entries(groupedBySource).map(([source, amount]) => ({
    category: source,
    amount: amount,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};

export const prepareIncomeLineChartData = (data = []) => {
  // Sort by date first
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by date and sum amounts for same date
  const groupedByDate = {};
  
  sortedData.forEach((item) => {
    const dateKey = moment(item?.date).format('Do MMM');
    if (groupedByDate[dateKey]) {
      groupedByDate[dateKey].amount += Number(item?.amount || 0);
      groupedByDate[dateKey].sources.push(item?.source);
    } else {
      groupedByDate[dateKey] = {
        amount: Number(item?.amount || 0),
        sources: [item?.source],
      };
    }
  });

  // Convert to chart data array
  const chartData = Object.entries(groupedByDate).map(([date, data]) => ({
    month: date,
    amount: data.amount,
    category: data.sources.join(', '), // Show all sources for tooltip
  }));

  return chartData;
};
