import React, { useState,useEffect  } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, TextField, Typography, Box, Modal,useTheme } from '@mui/material';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";  
import { saveAs } from "file-saver";




const DateLivraisonTable = ({ roles }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false); 
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedDoPiece, setSelectedDoPiece] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const canviewlistearticles = roles.some(role => role.codeRole === "dbc");
    const canExporterExcelListeCommandes = roles.some(role => role.codeRole === "elc");
    const canExporterExcelListeDétailsBonCommande = roles.some(role => role.codeRole === "edbc");

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Commandes");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataToSave, "commandes.xlsx");
    };
    const exportDetailToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(detailData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Details");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataToSave, "details.xlsx");
    };


    const columns = [
        {
            field: 'id', headerName: 'ID', width: 20, cellClassName: "name-column--cell"
        },
        {
            field: 'doPiece',
            headerName: 'N° bon de commande',
            width: 150,
            renderCell: (params) => (
                <a
                    href="#"
                    style={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} 
                    onClick={(e) => {
                        e.preventDefault();
                        if (canviewlistearticles) {
                            setSelectedDoPiece(params.value);
                            setModalOpen(true);
                        }
                    }}
                >
                    {params.value}
                </a>
            ),
        },

        { field: 'doSouche', headerName: 'Souche', width: 100 },
        { field: 'doDate', headerName: 'Date', width: 100 },
        { field: 'ctNum', headerName: 'Code client', width: 100 },
        { field: 'ctIntitule', headerName: 'Client', width: 240 },
        { field: 'doDateLivr', headerName: 'Date de livraison', width: 150 },
        {
            field: 'iconStatus',
            headerName: 'État',
            width: 50,
            renderCell: (params) => {
                return params.value === 'green' ? (
                    <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CheckCircleIcon style={{ color: 'orange' }} />
                );
            },
        }
    ];
    useEffect(() => {
        if (selectedDoPiece) {
            fetchDetailData(selectedDoPiece);
        }
    }, [selectedDoPiece]);

    const detailColumns = [
        {
            field: 'arRef', headerName: "Référence de l'article", width: 200 },
        { field: 'dlDesign', headerName: 'Designation', width: 250 },
        { field: 'dlUnite', headerName: 'Unité', width: 200 },
        {
            field: 'dlQte',
            headerName: 'Quantité',
            width: 170,
            renderCell: (params) => (params.value === null ? "null" : params.value),
        },
        {
            field: 'dlPrixUnitaire',
            headerName: 'Montant',
            width: 150,
            renderCell: (params) => (params.value === null ? "null" : params.value),
        },
    ];
    const renderModal = () => {
        return (
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="detail-modal-title"
                aria-describedby="detail-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography id="detail-modal-title" variant="h6" component="h2">
                            Détails pour {selectedDoPiece}
                        </Typography>
                        {canExporterExcelListeDétailsBonCommande && (
                            <Button
                                onClick={exportDetailToExcel}
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<SaveAltIcon />}
                                style={{
                                    backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                                    color: theme.palette.mode === "light" ? "black" : colors.grey[100],


                                }}
                            >
                                Exporter en Excel
                            </Button>
                        )}
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
                        <DataGrid
                            rows={detailData.map((row, index) => ({ ...row, id: index }))}
                            columns={detailColumns}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>
            </Modal>
        );
    };

    const fetchDetailData = async (doPiece) => {
        try {
            const response = await axios.get(
                `https://localhost:7010/api/Date_livraison/filtered-data-details/${doPiece}`
            );
            setDetailData(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des données détaillées..");
        }
    };
    const handleLoadData = async () => {
        if (startDate === "" && endDate === "") {
            toast.error('Veuillez sélectionner les dates de début et de fin.');
            return;
        }

        if (startDate === "") {
            toast.error('Veuillez sélectionner la date de début.');
            return;
        }

        if (endDate === "") {
            toast.error('Veuillez sélectionner la date de fin.');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('La date de début ne peut pas être supérieure à la date de fin.');
            return;
        }

        try {
            const response = await axios.get(`https://localhost:7010/api/Date_livraison/filtered-data`, {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });

            if (response.data.length === 0) {
                toast.error('Aucune donnée trouvée pour la plage de dates spécifiée.');
            } else {
                setData(response.data);
                setShowTable(true);
            }

        } catch (error) {
            toast.error('Erreur lors de la récupération des données.');
        }
    };

    const rowsWithId = data.map((row, index) => ({
        ...row,
        id: row.id || `missing-id-${index}`,
    }));

    return (
        <Container>
            <Box m="20px" ml={-2}> {/* Add ml={-2} to move the header a bit to the left */}
                <Header title="Les commandes" subtitle="La liste des commandes" />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box width="30%">
                    <TextField
                        label="Date de début"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true, style: { color: theme.palette.mode === 'dark' ? 'white' : 'black' } }}
                        InputProps={{ style: { color: theme.palette.mode === 'dark' ? 'white' : 'black' } }}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                                },
                            },
                        }}
                    />
                </Box>
                <Box width="30%">

                    <TextField
                        label="Date de fin"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true, style: { color: theme.palette.mode === 'dark' ? 'white' : 'black' } }}
                        InputProps={{ style: { color: theme.palette.mode === 'dark' ? 'white' : 'black' } }}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                                },
                            },
                        }}
                    />
                </Box>
                <Box>
                    <Button
                        onClick={handleLoadData}
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{
                            backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                            color: theme.palette.mode === "light" ? "black" : colors.grey[100],


                        }}
                    >
                        Afficher
                    </Button>
                </Box>
            </Box>
            {showTable && (
                <Box
                    m="40px 0 0 0"
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
                >  <Box
                    display="flex"
                    justifyContent="flex-end"
                    mb={4}
                >
                        {canExporterExcelListeCommandes && (
                            <Button
                                onClick={exportToExcel}
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<SaveAltIcon />}
                                style={{
                                    backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                                    color: theme.palette.mode === "light" ? "black" : colors.grey[100],


                                }}
                            >
                                Exporter en Excel
                            </Button>
                        )}
                    </Box>
                    <DataGrid rows={rowsWithId} columns={columns} getRowId={(row) => row.id} />
                </Box>
            )}
            {renderModal()}

            <ToastContainer />
        </Container>
    );
};

export default DateLivraisonTable;