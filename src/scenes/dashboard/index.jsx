import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, MenuItem, Select } from "@mui/material";



const Dashboard = ({ roles }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [facturesData, setFacturesData] = useState([]);
    const [biellesData, setBiellesData] = useState([]);
    const [retenuData, setRetenuData] = useState([]);
    const [règlementData, setRèglementData] = useState([]);
    const facturesTotalTTC = facturesData?.total_TTC || 0;
    const biellesDataTotalTTC = biellesData?.total_TTC || 0;
    const RetenuData_total_RG_Montant = retenuData?.total_RG_Montant || 0;
    const RèglementData_total_RG_Montant = règlementData?.total_RG_Montant || 0;
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [totalRGMontantData, setTotalRGMontantData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [percentageBL, setPercentageBL] = useState(0);
    const [percentageFA, setPercentageFA] = useState(0);
    const [percentageRetenues, setPercentageRetenues] = useState(0);
    const [percentageReglements, setPercentageReglements] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [transactions2, setTransactions2] = useState([]);
    const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear());
    const [selectedYear3, setSelectedYear3] = useState(new Date().getFullYear());


    const canViewTB = roles.some(role => role.codeRole === "tb");
    const canViewTF = roles.some(role => role.codeRole === "tf");
    const canViewTRS = roles.some(role => role.codeRole === "trs");
    const canViewTR = roles.some(role => role.codeRole === "tr");
    const canViewDRF = roles.some(role => role.codeRole === "drf");
    const canViewMC = roles.some(role => role.codeRole === "mc");
    const canViewMA = roles.some(role => role.codeRole === "ma");



    useEffect(() => {
        fetchFactureData();
        fetchBiellesData();
        fetchRetenu();
        fetchRéglement();
        fetchTotalRGMontantData();
        fetchPercentageBLData();
        fetchPercentageFAData();
        fetchPercentageRetenuesData(); // Ajoutez cette ligne
        fetchPercentageReglementsData();
        fetchTransactions();
        fetchTransactions2();

    }, [selectedYear, selectedYear2, selectedYear3]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };
    const handleYearChange2 = (event) => {
        setSelectedYear2(event.target.value);
    };
    const handleYearChange3 = (event) => {
        setSelectedYear3(event.target.value);
    };
   
    const fetchTransactions2 = async () => {
        try {
            const response = await axios.get(`https://localhost:7010/api/Dashboard/TopArticlesByTotalTTC/${selectedYear2}`);
            setTransactions2(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
        }
    };
    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`https://localhost:7010/api/Dashboard/TotalTTCByTop5Client/${selectedYear3}`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
        }
    };


    const fetchPercentageBLData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalTTC_BLP");
            setPercentageBL(response.data.percentage); // Ajoutez '.data' ici
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
            setPercentageBL(0); // Mettez à jour l'état ici au lieu de retourner 0
        }
    };
    const fetchPercentageFAData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalTTC_fAP");
            setPercentageFA(response.data.percentage); // Ajoutez '.data' ici
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
            setPercentageFA(0); // Mettez à jour l'état ici au lieu de retourner 0
        }
    };

    const fetchPercentageRetenuesData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalRetenueP");
            setPercentageRetenues(response.data.percentage);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
            setPercentageRetenues(0);
        }
    };


    const getProgressValue = (percentage) => {
        if (percentage < 0) {
            return 0;
        }

        const maxValue = 100; // Vous pouvez définir la valeur maximale de pourcentage pour le progrès
        const progressValue = percentage / maxValue;
        return progressValue > 1 ? 1 : progressValue;
    };

    const fetchPercentageReglementsData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalReglementP");
            setPercentageReglements(response.data.percentage);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'API :", error);
            setPercentageReglements(0);
        }
    };



    const fetchTotalRGMontantData = async () => {
        try {
            const response = await axios.get(
                `https://localhost:7010/api/Dashboard/Total_RG_MontantByYearMonth/${selectedYear}`
            );
            setTotalRGMontantData(response.data);
            fetchData(response.data); // Call fetchData with response data
        } catch (error) {
            console.error("Error fetching Total RG Montant data:", error);
        }
    };



    const fetchData = async (totalRGMontantData) => {
        try {
            const response = await axios.get(
                `https://localhost:7010/api/Dashboard/TotalTTCByYearMonth/${selectedYear}`
            );
            const data = response.data;

            // Create objects with the months as keys and the value set to 0
            const defaultMonthsTTC = {};
            const defaultMonthsRGMontant = {};
            for (let i = 1; i <= 12; i++) {
                defaultMonthsTTC[`${i}`] = 0;
                defaultMonthsRGMontant[`${i}`] = 0;
            }

            // Merge the fetched data with the default values
            data.forEach((item) => {
                defaultMonthsTTC[`${item.mois}`] = item.total_TTC;
            });
            totalRGMontantData.forEach((item) => {
                defaultMonthsRGMontant[`${item.mois}`] += item.total_RG_Montant;
            });


            // Transform the merged data into a format compatible with the LineChart component
            const formattedData = [
                {
                    id: "Total Facturation",
                    color: colors.greenAccent[500],
                    data: Object.entries(defaultMonthsTTC).map(([key, value]) => ({
                        x: key,
                        y: value,
                    })),
                },
                // Add the new line for Total RG Montant
                {
                    id: "Total Réglement",
                    color: colors.blueAccent[500],
                    data: Object.entries(defaultMonthsRGMontant).map(([key, value]) => ({
                        x: key,
                        y: value,
                    })),
                },
            ];

            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };





    const fetchFactureData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalTTC_fA");
            setFacturesData(response.data);
            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);

        }
    };
    const fetchBiellesData = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalTTC_BL");
            setBiellesData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setIsLoading(false);

        }
    };

    const fetchRetenu= async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalRetenue");
            setRetenuData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setIsLoading(false);

        }
    };
    const fetchRéglement = async () => {
        try {
            const response = await axios.get("https://localhost:7010/api/Dashboard/TotalReglement");
            setRèglementData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setIsLoading(false);

        }
    };

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Bienvenue sur votre dashboard" />
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"

            >
                {/* ROW 1 */}
                {canViewTB && (
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="30px" 

                    >
                        <StatBox
                            title={
                                isLoading ? "Loading..." : biellesDataTotalTTC.toLocaleString()
                            }
                            subtitle="Total des bons de livraison"
                            progress={getProgressValue(percentageBL)} // Utilisez la fonction getProgressValue pour calculer le ratio
                            increase={`${percentageBL.toFixed(2)}%`} // Update this value with the fetched percentage
                            icon={
                                <img src="/assets/bancaire (1).png" alt="Dinar" style={{ width: '26px', height: '26px' }} />
                            }
                        />
                    </Box>
                )}

                {canViewTF && (

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="30px" 

                    >
                        <StatBox
                            title={
                                isLoading ? "Loading..." : facturesTotalTTC.toLocaleString()
                            }
                            subtitle="Total des factures"
                            progress={getProgressValue(percentageFA)} // Utilisez la fonction getProgressValue pour calculer le ratio
                            increase={`${percentageFA.toFixed(2)}%`} // Update this value with the fetched percentage
                            icon={
                                <img src="/assets/bancaire (1).png" alt="Dinar" style={{ width: '26px', height: '26px' }} />
                            }
                        />
                    </Box>
                )}

                {canViewTRS && (

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="30px" 

                    >
                        <StatBox
                            title={
                                isLoading ? "Loading..." : RetenuData_total_RG_Montant.toLocaleString()
                            }
                            subtitle="Total des retenues à la source"
                            progress={getProgressValue(percentageRetenues)}
                            increase={`${percentageRetenues.toFixed(2)}%`}
                            icon={
                                <img src="/assets/bancaire (1).png" alt="Dinar" style={{ width: '26px', height: '26px' }} />
                            }
                        />
                    </Box>
                )}

                {canViewTR && (

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="30px" 

                    >
                        <StatBox
                            title={
                                isLoading ? "Loading..." : RèglementData_total_RG_Montant.toLocaleString()
                            }
                            subtitle="Total des règlements"
                            progress={getProgressValue(percentageReglements)}
                            increase={`${percentageReglements.toFixed(2)}%`}
                            icon={
                                <img src="/assets/bancaire (1).png" alt="Dinar" style={{ width: '26px', height: '26px' }} />
                            }
                        />
                    </Box>
                )}

                {/* ROW 2 */}
                {canViewDRF && (
                    <>
                        <Box
                            gridColumn="span 12"
                            gridRow="span 2"
                            backgroundColor={colors.primary[400]}
                            borderRadius="30px" 

                        >

                            <Box
                                mt="25px"
                                p="0 30px"
                                display="flex "
                                justifyContent="space-between"
                                alignItems="center"

                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight="600"
                                        color={colors.grey[100]}
                                    >
                                        Réglement/Facturation
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        fontWeight="bold"
                                        color={colors.greenAccent[500]}
                                    >
                                    </Typography>
                                </Box>
                                <Box>

                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box flexGrow={1} height="250px" m="-20px 0 0 0" marginRight="16px">
                                    <LineChart
                                        chartKey={`linechart-${Date.now()}`}
                                        isDashboard={true}
                                        data={chartData}
                                    />
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box position="relative">
                                        {/* Adjust the position properties as needed */}
                                        <Box position="absolute" top="-150px" left="-70px">
                                            <Typography variant="subtitle1">Année</Typography>
                                        </Box>
                                        <Box position="absolute" top="-131px" left="-90px" >
                                            <FormControl >
                                                <Select
                                                    labelId="year-select-label"
                                                    id="year-select"
                                                    value={selectedYear}
                                                    onChange={handleYearChange}
                                                >
                                                    <MenuItem value={2021}>2021</MenuItem>
                                                    <MenuItem value={2022}>2022</MenuItem>
                                                    <MenuItem value={2023}>2023</MenuItem>
                                                    <MenuItem value={2024}>2024</MenuItem>
                                                    <MenuItem value={2025}>2025</MenuItem>
                                                    <MenuItem value={2026}>2026</MenuItem>

                                                    {/* Add more years if needed */}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </>)}



                {canViewMC && (
                    <>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box position="relative">
                                <Box position="absolute" top="1px" left="350px" zIndex={1}>
                                    <FormControl style={{ minWidth: '10px', minHeight: '-100px' }}>
                                        <Select
                                            labelId="year-select-label2"
                                            id="year-select2"
                                            value={selectedYear3}
                                            onChange={handleYearChange3}
                                        >
                                            <MenuItem value={2021}>2021</MenuItem>
                                            <MenuItem value={2022}>2022</MenuItem>
                                            <MenuItem value={2023}>2023</MenuItem>
                                            <MenuItem value={2024}>2024</MenuItem>
                                            <MenuItem value={2025}>2025</MenuItem>
                                            <MenuItem value={2026}>2026</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>

                   


                    <Box
                        gridColumn="span 5"
                        gridRow="span 3"
                            backgroundColor={colors.primary[400]}
                            borderRadius="30px"
                    >
                        {/* Ajoutez ce conteneur pour utiliser position sticky */}
                        <Box style={{ position: "sticky", top: 0 }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`4px solid ${colors.primary[500]}`}
                                colors={colors.grey[100]}
                                p="15px"
                            >
                                <Typography color={colors.grey[100]} variant="h4" fontWeight="600">
                                        Les 5 meilleurs clients
                                </Typography>
                            </Box>
                        </Box>

                        {/* Ajoutez un conteneur avec un overflow pour permettre le défilement des clients */}
                        <Box overflow="auto" style={{ maxHeight: "calc(100% - 64px)" }}>
                            {transactions.map((transaction, i) => (
                                <Box
                                    key={`${transaction.id || "fallback-id"}-${i}`}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    borderBottom={`4px solid ${colors.primary[500]}`}
                                    p="15px"
                                >
                                    <Box>
                                        <Typography
                                            color={colors.greenAccent[500]}
                                            variant="subtitle1"
                                        >
                                            Code client
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="600"
                                        >
                                            {transaction.cT_Num}
                                        </Typography>
                                        <Typography
                                            color={colors.greenAccent[500]}
                                            variant="subtitle1"
                                        >
                                            Client
                                        </Typography>
                                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                            {transaction.cT_Intitule}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column-reverse">
                                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                            {`${transaction.total_TTC} TND`}
                                        </Typography>
                                        <Typography
                                            color={colors.greenAccent[500]}
                                            variant="subtitle1"
                                            style={{ marginTop: '-45px' }}
                                        >
                                            Total du chiffre d'affaires
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        </Box>
                        </>

                )}

                {/* ROW 3 */}
                {canViewMA && (
                    <>

                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box position="relative">
                        
                        <Box position="absolute" top="1px" left="350px" zIndex={1}>
                            <FormControl style={{ }}>
                                <Select
                                    labelId="year-select-label"
                                    id="year-select"
                                    value={selectedYear2}
                                    onChange={handleYearChange2}
                                >
                                    <MenuItem value={2021}>2021</MenuItem>
                                    <MenuItem value={2022}>2022</MenuItem>
                                    <MenuItem value={2023}>2023</MenuItem>
                                    <MenuItem value={2024}>2024</MenuItem>
                                    <MenuItem value={2025}>2025</MenuItem>
                                    <MenuItem value={2026}>2026</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>



                <Box
                    gridColumn="span 5"
                    gridRow="span 3"
                    backgroundColor={colors.primary[400]}
                     borderRadius="30px"

                >
                    {/* Ajoutez ce conteneur pour utiliser position sticky */}
                    <Box style={{ position: "sticky", top: 0 }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography color={colors.grey[100]} variant="h4" fontWeight="600">
                                Les 5 meilleurs articles
                            </Typography>
                        </Box>
                    </Box>

                    {/* Ajoutez un conteneur avec un overflow pour permettre le défilement des articles */}
                    <Box overflow="auto" style={{ maxHeight: "calc(100% - 64px)" }}>
                        {transactions2.map((transaction, i) => (
                            <Box
                                key={`${transaction.aR_Ref || "fallback-id"}-${i}`}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`4px solid ${colors.primary[500]}`}
                                p="15px"
                            >
                                <Box>
                                    <Typography
                                        color={colors.greenAccent[500]}
                                        variant="subtitle1"
                                    >
                                        Référence
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontWeight="600"
                                    >
                                        {transaction.aR_Ref}
                                    </Typography>
                                    <Typography
                                        color={colors.greenAccent[500]}
                                        variant="subtitle1"
                                    >
                                        Désignation
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                        {transaction.aR_Design}
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="column-reverse">
                                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                        {`${transaction.total_TTC} TND`}
                                    </Typography>
                                    <Typography
                                        color={colors.greenAccent[500]}
                                        variant="subtitle1"
                                        style={{ marginTop: "-45px" }}
                                    >
                                        Total du chiffre d'affaires
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
</>
                )}

              
            </Box>
        </Box>
    );
};

export default Dashboard;
