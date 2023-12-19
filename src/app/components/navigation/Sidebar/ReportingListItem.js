import { ListItemButton, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SellIcon from '@mui/icons-material/Sell';
import { useRouter } from 'next/navigation'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DashboardIcon from '@mui/icons-material/Dashboard';

const reportingOptions = [
    {
        optionName: "Dashboard",
        icon: DashboardIcon,
        route: '/reportes'
    },
    {
        optionName: "Usuarios",
        icon: ManageAccountsIcon,
        route: '/reportes/usuariosRegistrados'
    },
    {
        optionName: "Clientes",
        icon: PeopleIcon,
        route: '/reportes/clientes'
    },
    {
        optionName: "Ventas",
        icon: SellIcon,
        route: "/reportes/ventas"
    },
    {
        optionName: "Inventarios",
        icon: InventoryIcon,
        route: '/reportes/inventarios'
    },
    {
        optionName: "Ingresos",
        icon: AttachMoneyIcon,
        route: "/reportes/economicReport"
    },
];

const reportingListItem = ({ open }) => {
    const router = useRouter();
    return (
        <>
            {open && <Typography sx={{ margin: '0.2rem' }}>Administracion y Analisis</Typography>}
            <ListItem disablePadding sx={{ display: 'block' }}>
                {reportingOptions.map(option => {
                    return (
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={() => { router.push(option.route) }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <option.icon />
                            </ListItemIcon>
                            <ListItemText sx={{ opacity: open ? 1 : 0 }} >{option.optionName}</ListItemText>
                        </ListItemButton>
                    );
                })}
            </ListItem>
        </>
    );
};

export default reportingListItem;