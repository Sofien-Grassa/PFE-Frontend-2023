import { Box, useTheme, Button, Switch, FormControlLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import React, { useState, useEffect } from "react"; 
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Header from "../../components/Header";

const HistoriqueRessource = ({ roles }) => {
    const [data, setdata] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const canExporterExcelListeHistoriqueRessources = roles.some(role => role.codeRole === "ehr");
    const [currentEtat, setCurrentEtat] = useState(1); // 1 = En arrêts, 2 = En panne

    useEffect(() => {
        axios.get(`https://localhost:7010/api/Ressources/RessourcePanneArrêts/${currentEtat}`)
            .then((result) => {
                const updatedData = result.data.map(item => {
                    if (item.rpEtat === 1) item.rpEtat = 'En arrêts';
                    else if (item.rpEtat === 2) item.rpEtat = 'En panne';
                    return item;
                });
                setdata(updatedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [currentEtat]);

    // Define columns for DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'rpCode', headerName: 'Code', width: 200 },
        { field: 'rpEtat', headerName: 'État', width: 200 },
        { field: 'dateDebut', headerName: 'Date de début', width: 250, type: 'dateTime', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
        { field: 'dateFin', headerName: 'Date de fin', width: 250, type: 'dateTime', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    ];
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historique_Ressource");
        XLSX.writeFile(wb, "Historique_Ressource.xlsx");
    };

    return (
        <Box m="20px">
            <Header title="L'historique des ressources" subtitle="La Liste de l'Historique des Ressources" />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',  // réduire la marge en bas
                }}
            >
                <Box></Box> {/* laisser de l'espace à gauche */}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    }}
                >
                    {canExporterExcelListeHistoriqueRessources && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveAltIcon />}
                            onClick={exportToExcel}
                            style={{
                                backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                                color: theme.palette.mode === "light" ? "black" : colors.grey[100],
                                borderRadius: "30px",
                                marginTop: "-75px"
                            }}
                        >
                            Exporter en Excel
                        </Button>
                    )}

                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentEtat === 2}
                                onChange={(event) => setCurrentEtat(event.target.checked ? 2 : 1)}
                                color="primary"
                                sx={{
                                    '&.Mui-checked': {
                                        color: theme.palette.mode === "dark" ? "white" : "",
                                        '& .MuiSwitch-thumb': {
                                            backgroundColor: theme.palette.mode === "dark" ? "white" : "",
                                        },
                                        '& + .MuiSwitch-track': {
                                            backgroundColor: theme.palette.mode === "dark" ? "white" : "",
                                        }
                                    },
                                    '& .MuiSwitch-thumb': {
                                        backgroundColor: theme.palette.mode === "dark" ? "white" : "",
                                    },
                                    '& + .MuiSwitch-track': {
                                        backgroundColor: theme.palette.mode === "dark" ? "white" : "",
                                    },
                                }}
                            />
                        }
                        label={currentEtat === 2 ? "En panne" : "En arrêts"}
                        style={{
                            marginTop: '5px',
                        }}
                    />

                </Box>
            </Box>



            <Box
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: theme.palette.mode === "light"
                            ? "1px solid black"
                            : "1px solid rgba(224, 224, 224, 1)",
                        color: theme.palette.mode === "light" ? "black" : colors.grey[100],
                        fontWeight: theme.palette.mode === "light" ? 1000 : "normal",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.mode === "light"
                            ? "#63b9f1"
                            : colors.blueAccent[700],
                        borderBottom: "none",
                        color: theme.palette.mode === "light" ? "black" : colors.grey[100],
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: theme.palette.mode === "light" ? "bold" : "normal",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: theme.palette.mode === "light"
                            ? "#63b9f1"
                            : colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid rows={data} columns={columns} />
            </Box>
        </Box>
    );
};

export default HistoriqueRessource;
