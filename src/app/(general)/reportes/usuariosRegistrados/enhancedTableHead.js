import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

const enhancedTableHead = (props) => {
    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: false,
            label: 'Dirección',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'E-mail',
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Celular',
        },
        {
            id: 'created_at',
            numeric: true,
            disablePadding: false,
            label: 'Fecha de Registro',
        },
    ];

    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding='normal'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default enhancedTableHead;