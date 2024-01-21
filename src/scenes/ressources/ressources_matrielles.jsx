import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {    Modal} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
const Ressources = ({ roles, userId }) => {
    const [data, setdata] = useState([]);
    const canSupprimerUser = roles.some(role => role.codeRole === "rp01");
    const canConsulterEtat = roles.some(role => role.codeRole === "er");
    const canExporterExcelListeRessources = roles.some(role => role.codeRole === "elr");

    const [modalOpen, setModalOpen] = useState(false);
  

  

    useEffect(() => {
        getData();
    }, []);


    const getData = () => {
        axios.get('https://localhost:7010/api/Ressources/Ressources')
            .then((result) => {
                setdata(result.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }
    function handleRpEtatChange(rowId, newValue, onRpEtatChange) {
        // Log the data being sent in the request
        console.log(`Sending request for rowId: ${rowId}, newValue: ${newValue}, userId: ${userId}`);

        // Send an HTTP PUT request to update the RpEtat value in the database
        console.log(`Row ID: ${rowId}`);
        axios
            .put(`https://localhost:7010/api/Ressources/${rowId}`, { RpEtat: newValue, UserId: userId })
            .then(response => {
                console.log("Response received:", response);
                if (typeof onRpEtatChange === 'function') {
                    onRpEtatChange(newValue);
                }
            })
            .catch(error => {
                if (error && error.response && error.response.status === 404) {
                    console.log("");
                } else {
                    // Handle other errors here
                    console.error(error);
                }
            });
    }

  

    function RpEtatCellRenderer(params) {
        const { value, onRpEtatChange, rowId, userId } = params;
        const sanitizedValue = value === null ? '' : value; // check if value is null and replace with empty string

        const [selectedValue, setSelectedValue] = useState(sanitizedValue);
        const [modalOpen, setModalOpen] = useState(false);
        const [dateDebut, setDateDebut] = useState("");
        const [dateFin, setDateFin] = useState("");

        const handleChange = (event) => {
            const newValue = event.target.value;
            setSelectedValue(newValue);
            if (newValue === '1' || newValue === '2') {
                setModalOpen(true);
            } else if (newValue === '0') {
                handleRpEtatChange(rowId, newValue, onRpEtatChange);
            }
        };


        const handleSubmit = (event) => {
            event.preventDefault();
            console.log("handleSubmit rowId: ", rowId); // Add this line

            axios
                .put(`https://localhost:7010/api/Ressources/UpdateRpEtatpanne/${rowId}`, {
                    RpEtat: selectedValue,
                    UserId: userId,
                    DateDebut: dateDebut,
                    DateFin: dateFin
                })
                .then(response => {
                    console.log("Response received:", response);
                    if (typeof onRpEtatChange === 'function') {
                        onRpEtatChange(selectedValue);
                    }
                    setModalOpen(false);
                    toast.success("La mise à jour a été effectuée avec succès !");
                })
                .catch(error => {
                    if (error && error.response && error.response.status === 404) {
                        console.log("");
                    } else {
                        // Handle other errors here
                        console.error(error);
                        toast.error("Une erreur s'est produite lors de la mise à jour !");
                    }
                });
        };


        return (
            <div>
                <Select value={selectedValue} onChange={handleChange}>
                    <MenuItem value="0">En marche</MenuItem>
                    <MenuItem value="1">En arrêts</MenuItem>
                    <MenuItem value="2">En panne</MenuItem>
                </Select>

                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "35%",
                            left: "58%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "300px",
                            padding: "2rem",
                            bgcolor: "background.paper",
                            borderRadius: "10px",
                            boxShadow: 24,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                    Enter Dates
                </Typography>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (dateDebut === "" && dateFin === "") {
                                toast.error('Veuillez sélectionner les dates de début et de fin.');
                                return;
                            }
                            if (dateDebut === "" ) {
                                toast.error('Veuillez sélectionner la date de début.');
                                return;
                            }
                            if (dateFin === "") {
                                toast.error('Veuillez sélectionner la date de fin.');
                                return;
                            }
                            if (new Date(dateDebut) > new Date(dateFin)) {
                                toast.error('La date de début ne peut pas être supérieure à la date de fin.');
                                return;
                            }
                            handleSubmit(e);
                        }} style={{ width: '100%', marginTop: '1rem' }}>

                    <Box component="label">
                        <Typography>Date de début:</Typography>
                        <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} style={{ width: '100%', margin: '0.5rem 0' }} />
                    </Box>
                    <Box component="label">
                        <Typography>Date de fin:</Typography>
                        <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} style={{ width: '100%', margin: '0.5rem 0' }} />
                    </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" variant="contained" color="primary">Envoyer</Button>&nbsp;&nbsp;
                        <Button variant="contained" color="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    </div>
);
    }
    function onRpEtatChange(newValue) {
        console.log(`New value: ${newValue}`);
    }

    
    function handleDelete(id) {
        if (window.confirm("Ètes-vous sûr de vouloir supprimer cet ressource") == true) {
            axios.delete(`https://localhost:7010/api/Ressources/${id}?userId=${userId}`, {
                params: {
                    userId: userId
                }
            })
                .then(() => {
                    // Remove the deleted row from the data array
                    setdata((prevData) => prevData.filter((row) => row.id !== id));
                    toast.success("La ressource a été supprimé");

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
            field: "id", headerName: "ID",
            cellClassName: "name-column--cell",
             width: 100
        },
        {
            field: "rpCode",
            headerName: "Code",
            width: 170,

        },
        {
            field: "rpIntitule",
            headerName: "Intitulé",
            width: 250, 

        },
        {
            field: "rpImmatriculation",
            headerName: " Matriculation",
            width: 250, 
        },
          
     

    ];
    if (canConsulterEtat) {
        columns.push({
            field: 'rpEtat',
            headerName: 'État',
            width: 100,
            renderCell: (params) => (
                <div>
                    <RpEtatCellRenderer
                        value={params.value}
                        onRpEtatChange={handleRpEtatChange}
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
        XLSX.utils.book_append_sheet(wb, ws, "Ressources");
        XLSX.writeFile(wb, "ressources.xlsx");
    };
    
    return (
        <>
            <Box
                sx={{
                    position: "relative"
                }}
            >
                {canExporterExcelListeRessources && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: "20px",
                            bottom: "500px"
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
                    <Header title="Les ressources" subtitle="La liste des ressources" />
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
                        <DataGrid rows={data} columns={columns} />
                    </Box>
                </Box>
            </Box>
        </>
    );

};

export default Ressources;
