'use client'
import { Container, Box, Typography, Grid, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MONTHS } from '@/app/constants/months'
import { ENDPOINTS } from "@/app/constants/endpoints"
import axiosInterceptorInstance from "@/app/axios/interceptor"
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArticleIcon from '@mui/icons-material/Article';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GenericChart from "@/app/components/GenericChart"
import MostSelledProduct from './mostSelledProduct';
import Cards from "./cards"

const Reports = () => {

    const [year, setYear] = useState("" + dayjs().year());
    const [month, setMonth] = useState("");
    const [data, setData] = useState([])
    const [expensesData, setExpensesData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [mostSelledData, setMostSelledData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [chart, setChart] = useState("Ventas");
    let yearDate = "" + dayjs().year();
    let startDate = "";
    let endDate = "";
    let daysOfMonth = 0;

    useEffect(() => {
        getAllData().then(response => {
            setData(ordersData);
        });
    }, []);

    useEffect(() => {
        setGraphic();
    }, [usersData]);

    const getAllData = async () => {
        await getEconomicData();
        await getExpensesData();
        await getMostSelledsData();
        await getOrdersData();
        await getUsersData();
    }

    const setGraphic = () => {
        if (chart === "Ventas") {
            setOrderGraphic();
        }
        if (chart === "Egresos") {
            setExpenseGraphic();
        }
        if (chart === "Ingresos") {
            setIncomeGraphic();
        }
        if (chart === "Usuarios") {
            setUsersGraphic();
        }
    };

    const getEconomicData = async () => {
        let ruta = ENDPOINTS.dashboardIncomes;
        const incomes = await getData(ruta, false);
        let arraySize = daysOfMonth === 0 ? 12 : daysOfMonth;
        let incomeArray = Array(arraySize).fill(0);
        let total = 0;
        incomes.map(income => {
            total += parseFloat(income.total);
            let index = income.month ? income.month - 1 : income.day - 1;
            incomeArray[index] = income.total;
        });
        setTotalIncome(total);
        setIncomeData(incomeArray);
    };

    const getExpensesData = async () => {
        let ruta = ENDPOINTS.dashboardExpenses;
        const expenses = await getData(ruta, false);
        let arraySize = daysOfMonth === 0 ? 12 : daysOfMonth;
        let expensesArray = Array(arraySize).fill(0);
        let total = 0;
        expenses.map(expense => {
            total += parseFloat(expense.total_amount);
            let index = expense.month ? expense.month - 1 : expense.day - 1;
            expensesArray[index] = expense.total_amount;
        });
        setTotalExpenses(total);
        setExpensesData(expensesArray);
        if (data.length === 0) {
            setData(expensesArray);
        }
    };

    const getUsersData = async () => {
        let ruta = ENDPOINTS.dashboardUsers;
        const users = await getData(ruta, false);
        let arraySize = daysOfMonth === 0 ? 12 : daysOfMonth;
        let usersArray = Array(arraySize).fill(0);
        let total = 0;
        users.map(user => {
            total += parseInt(user.total_users);
            let index = user.month ? user.month - 1 : user.day - 1;
            usersArray[index] = user.total_users;
        });
        setTotalUsers(total);
        setUsersData(usersArray);
    }

    const getOrdersData = async () => {
        let ruta = ENDPOINTS.dashboardOrders;
        const orders = await getData(ruta, false);
        let arraySize = daysOfMonth === 0 ? 12 : daysOfMonth;
        let ordersArray = Array(arraySize).fill(0);
        let total = 0;
        orders.map(order => {
            total += parseInt(order.total_orders);
            let index = order.month ? order.month - 1 : order.day - 1;
            ordersArray[index] = order.total_orders;
        });
        setTotalOrders(total);
        setOrdersData(ordersArray);
        return ordersArray;
    };

    const getMostSelledsData = async () => {
        let ruta = ENDPOINTS.dashboardMostSelleds;
        const mostSelled = await getData(ruta, true);
        setMostSelledData(mostSelled);
    };

    const getData = async (ruta, selledQuery) => {
        if (daysOfMonth === 0) {
            ruta += selledQuery ? (yearDate + "-01-01/" + yearDate + "-12-31") : yearDate;
        } else {
            ruta += startDate + "/" + endDate;
        }
        let res = await axiosInterceptorInstance.get(ruta)
            .then(response => {
                return response.data
            });
        return res;
    };

    const handleYearChange = (newYear) => {
        yearDate = "" + newYear.year();
        if (month != "") {
            let index = MONTHS.findIndex(data => data === month) + 1;
            index = index < 10 ? "0" + index : "" + index;
            startDate = yearDate + "-" + index + "-01";
            endDate = dayjs(startDate).endOf("month").format("YYYY-MM-DD");
            daysOfMonth = dayjs(startDate).daysInMonth();
        }
        setYear(yearDate);
        getAllData();
    };

    const handleMonthChange = (newMonth) => {
        if (newMonth != "") {
            let index = MONTHS.findIndex(month => month === newMonth) + 1;
            index = index < 10 ? "0" + index : "" + index;
            yearDate = year;
            startDate = yearDate + "-" + index + "-01";
            endDate = dayjs(startDate).endOf("month").format("YYYY-MM-DD");
            daysOfMonth = dayjs(startDate).daysInMonth();
        } else {
            startDate = "";
            endDate = "";
            daysOfMonth = 0;
        }
        setMonth(newMonth);
        getAllData();
    };

    const setOrderGraphic = () => {
        setChart("Ventas");
        setData(ordersData);
    };

    const setIncomeGraphic = () => {
        setChart("Ingresos");
        setData(incomeData);
    };

    const setExpenseGraphic = () => {
        setChart("Egresos");
        setData(expensesData);
    };

    const setUsersGraphic = () => {
        setChart("Usuarios");
        setData(usersData);
    };

    return (
        <Container sx={{ minHeight: "85vh", marginTop: "90px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    sx={{ fontWeight: 'bold', color: '#16193b', marginTop: "10px" }}
                    variant="h4"
                    id="dashBoardTitle"
                >
                    Dashboard
                </Typography>
                <Box>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="monthSelectLabel">Mes</InputLabel>
                        <Select
                            labelId="monthSelectLabel"
                            id="monthSelect"
                            value={month}
                            label="Mes"
                            onChange={e => handleMonthChange(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Ninguno</em>
                            </MenuItem>
                            {MONTHS.map(month => (
                                <MenuItem value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label={'Año'} openTo="year" views={['year']}
                            defaultValue={dayjs()}
                            onChange={newValue => handleYearChange(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: "140px", mt: "8px", ml: "8px" }}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>

            <Grid container sx={{ marginTop: "25px" }}>
                <Grid item xs={3} sx={{ minHeight: "200px", padding: "1rem" }}>
                    <Cards fun={setOrderGraphic} title="Nuevas Ventas" amount={totalOrders} color="#f44336" icono={<ShoppingBasketIcon fontSize='large' />} />
                </Grid>
                <Grid item xs={3} sx={{ minHeight: "200px", padding: "1rem" }}>
                    <Cards control={1} fun={setIncomeGraphic} title="Total Ingresos" amount={totalIncome} color="#4caf50" icono={<AttachMoneyIcon fontSize='large' />} />
                </Grid>
                <Grid item xs={3} sx={{ minHeight: "200px", padding: "1rem" }}>
                    <Cards control={1} fun={setExpenseGraphic} title="Total Egresos" amount={totalExpenses} color="#2196f3" icono={<ArticleIcon fontSize='large' />} />
                </Grid>
                <Grid item xs={3} sx={{ minHeight: "200px", padding: "1rem" }}>
                    <Cards fun={setUsersGraphic} title="Nuevos Usuarios" amount={totalUsers} color="#ffd301" icono={< AccountCircleIcon fontSize='large' />} />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={7} sx={{ minHeight: "400px", padding: "1rem" }}>
                    <GenericChart
                        xaxisData={month === "" ? MONTHS : Array.apply(null, Array(daysOfMonth)).map(function (x, i) { return i + 1; })}
                        yaxisData={data}
                        chartName={chart}
                        month={month}
                        year={year}
                    />
                </Grid>
                <Grid item xs="5" sx={{ minHeight: "400px", padding: "1rem" }}>
                    <MostSelledProduct data={mostSelledData} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Reports;