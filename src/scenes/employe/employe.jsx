import { Box, useTheme, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";


const Employe = ({ roles, userId }) => {
    const [data, setdata] = useState([]);
    const canSupprimerUser = roles.some(role => role.codeRole === "rp0");
    const canConsulterEtat = roles.some(role => role.codeRole === "ec");
    const canExporterExcelListeEmployeurs = roles.some(role => role.codeRole === "ele");

    useEffect(() => {
        getData();
    }, []);


    const getData = () => {
        axios.get('https://localhost:7010/api/Employeurs/Get_Employeurs')
            .then((result) => {
                setdata(result.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }
    function handleEmEtatChange(rowId, newValue, onEmEtatChange) {
        try {
            // Log the data being sent in the request
            console.log(`Sending request for rowId: ${rowId}, newValue: ${newValue}, userId: ${userId}`);

            // Send an HTTP PUT request to update the EmEtat value in the database
            axios.put(`https://localhost:7010/api/Employeurs/employeur/${rowId}`, { rpEtat: newValue, UserId: userId })
                .then(response => {
                    console.log("Response received:", response);
                    if (typeof onEmEtatChange === 'function') {
                        // Get the new EmEtat value from the response
                        const newEmEtat = response.data.EmEtat;
                        onEmEtatChange(newEmEtat);
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    }
    function EmEtatCellRenderer(params) {
        const { value, onEmEtatChange, rowId, userId } = params;
        const [selectedValue, handleChange] = useEmEtat(value, (newValue) => onEmEtatChange(rowId, newValue, userId));

        return (
            <Select value={selectedValue} onChange={handleChange}>
                <MenuItem value="0">En fonction</MenuItem>
                <MenuItem value="1">En congé</MenuItem>
            </Select>
        );
    }


    function onEmEtatChange(newValue) {
        console.log(`New value: ${newValue}`);
    }

    function useEmEtat(initialValue, onEmEtatChange) {
        const [value, setValue] = useState(initialValue !== undefined && initialValue !== null ? initialValue : '');

        const handleChange = (event) => {
            const newValue = event.target.value;
            setValue(newValue);
            onEmEtatChange(newValue);
        };

        return [value, handleChange];
    }


    function handleDelete(id) {
        if (window.confirm("Ètes-vous sûr de vouloir supprimer cet employé") == true) {
            axios.delete(`https://localhost:7010/api/Employeurs/${id}?userId=${userId}`, {
                params: {
                    userId: userId
                }
            })
                .then(() => {
                    // Remove the deleted row from the data array
                    setdata((prevData) => prevData.filter((row) => row.id !== id));
                    toast.success("L'employé a été supprimé");

                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                });
        }
    }


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {
            field: "id", headerName: "ID", cellClassName: "name-column--cell", width: 100 },
        {
            field: "emCode",
            headerName: "Code",
            width: 170,
        },
        {
            field: "emPrenom",
            headerName: "Prénom",
            width: 170,

        },
        {
            field: "emNom",
            headerName: " Nom",
            width: 170,
        },
        {
            field: "emFonction",
            headerName: " Fonction",
           width: 170,
        },

    ];

 

    if (canConsulterEtat) {
        columns.push({
            field: 'emEtat',
            headerName: 'État',
            width: 100,
            renderCell: (params) => (
                <div>
                    <EmEtatCellRenderer
                        value={params.value}
                        onEmEtatChange={handleEmEtatChange}
                        rowId={params.row.id}
                        userId={userId}
                    />
                </div>
            ),
        });
    }
    if (canSupprimerUser) {
        columns.push({
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => (
                <div>
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        });
    }
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employeurs");
        XLSX.writeFile(wb, "employeurs.xlsx");
    };


    return (
        <>
            <Box
                sx={{
                    position: "relative"
                }}
            >
                {canExporterExcelListeEmployeurs && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: "20px",
                            bottom: "500px" // Adjust this value to move the button up or down
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveAltIcon />}
                            onClick={exportToExcel}
                            style={{
                                backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                                color: theme.palette.mode === "light" ? "black" : colors.grey[100],


                            }}
                        >
                            Exporter en Excel
                        </Button>
                    </Box>
                )}

        <Box m="20px">
            <Header title="Les employés" subtitle="La liste des Employés" />
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
                <ToastContainer />
                <DataGrid  rows={data} columns={columns} />
            </Box>
            </Box>
            </Box>
        </>

    );
};

export default Employe;