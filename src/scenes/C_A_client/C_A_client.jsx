import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; 
import { Box,  useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import * as XLSX from "xlsx";

const Chiffre_affaire_client = ({ roles }) => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const canExporterExcelListeChiffreAffaireClient = roles.some(role => role.codeRole === "elcac");

    useEffect(() => {
        axios
            .get("https://localhost:7010/api/Chiffre_d_affaire_client/TotalTTCByClient")
            .then(async (response) => {
                const clients = response.data;

                const promises = clients.map(async (client) => {
                    const reglementResponse = await axios.get(
                        `https://localhost:7010/api/Chiffre_d_affaire_client/TotalReglementByClient/${client.cT_Num}`
                    );
                    const retenueResponse = await axios.get(
                        `https://localhost:7010/api/Chiffre_d_affaire_client/TotalRetenueByClient/${client.cT_Num}`
                    );

                   

                    return {
                        ...client,
                        reglement: reglementResponse.data[0], // Add [0] to access the first object in the array
                        retenue: retenueResponse.data[0], // Add [0] to access the first object in the array
                    };
                });

                const clientsWithData = await Promise.all(promises);
                setData(clientsWithData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);
    const ReglementRetenueCell = ({ reglement, retenue }) => (
        <div>
            <div>Règlement: {reglement ? reglement : 0}</div>
            <div>Retenue: {retenue ? retenue : 0}</div>
        </div>
    );

    const detailColumns = [
        { field: "cT_Num", headerName: "Code client", width: 250 },
        { field: "cT_Intitule", headerName: "Client", width: 250 },
        { field: "total_TTC", headerName: "Total chiffres d'affaire ", width: 250 },
        {
            field: "total",
            headerName: "Total",
            width: 250,
            renderCell: (params) => (
                <ReglementRetenueCell
                    reglement={params.row.reglement ? params.row.reglement.total_RG_Montant : 0}
                    retenue={params.row.retenue ? params.row.retenue.total_RG_Montant : 0}
                />
            ),
        },
    ];

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Chiffre_affaire_client");
        XLSX.writeFile(wb, "chiffre_affaire_client.xlsx");
    };


    return (
        <>
            <Box
                sx={{
                    position: "relative"
                }}
            >
                {canExporterExcelListeChiffreAffaireClient && (
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
            <Header title=" Les chiffres d'affaire clients" subtitle="La liste des chiffres d'affaire clients"/>
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
                    rows={data.map((row, index) => ({
                        id: index,
                        cT_Num: row.cT_Num,
                        cT_Intitule: row.cT_Intitule,
                        total_TTC: row.total_TTC,
                        reglement: row.reglement,
                        retenue: row.retenue,
                    }))}
                    columns={detailColumns}
                    getRowId={(row) => row.id}
                />

            </Box>
                </Box>
            </Box>
        </>
    );
};

export default Chiffre_affaire_client;
