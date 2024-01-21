import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";
import Header from "../../components/Header";

const ArticleRecommendations = () => {
    const [arRefs, setArRefs] = useState([]);
    const [selectedArRef, setSelectedArRef] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    useEffect(() => {
        fetchArRefs().then(setArRefs);
    }, []);

    const handleChange = async (event) => {
        setSelectedArRef(event.target.value);
        const recs = await fetchRecommendations(event.target.value);
        const filteredRecs = recs.filter(rec => rec.percentage >= 20);
        setRecommendations(filteredRecs);
    };


    return (
        <Container>
            <Box m="20px">
                <Header title="Prévisions d'Articles" subtitle="Gestion des recommandations d'articles" />
            </Box>
            <Box m="20px">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                backgroundColor: theme.palette.mode === "dark" ? 'colors.primary[400]' : colors.grey[800],
                                color: theme.palette.mode === "dark" ? colors.grey[800] : "inherit",
                                borderRadius: "30px"
                            }}
                        >

                            <FormControl fullWidth>
                                <InputLabel
                                    id="arRef-select-label"
                                    sx={{
                                        color: theme.palette.mode === "light" ? "#1b81e1" : "#1bcde1",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        transform: selectedArRef ? 'translate(12px, -20px) scale(0.75)' : '',
                                        '&.Mui-focused, &.MuiInputLabel-filled': {
                                            transform: 'translate(12px, -20px) scale(0.75)',  // Adjust values to your liking
                                        },
                                    }}
                                >
                                    Référence de l'article
                                </InputLabel>

                                <Select
                                    labelId="arRef-select-label"
                                    value={selectedArRef}
                                    onChange={handleChange}
                                >
                                    {arRefs.map((arRef, index) => (
                                        <MenuItem
                                            key={index}
                                            value={arRef}
                                            sx={{
                                                color: theme.palette.mode === "light" ? "black" : "inherit",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {arRef}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                backgroundColor: theme.palette.mode === "dark" ? 'colors.primary[400]' : colors.grey[800],
                                color: theme.palette.mode === "dark" ? colors.grey[800] : "inherit",
                                borderRadius: "30px"
                            }}
                        >

                            <Typography variant="h2" component="h3" gutterBottom sx={{
                                color: theme.palette.mode === "light" ? "#1b81e1" : "#1bcde1",
                                fontWeight: "bold",
                            }}>
                                Recommendations
                            </Typography>
                            {recommendations.map((rec, index) => (
                                <Typography
                                    key={index}
                                    variant="h5"
                                    sx={{
                                        color: theme.palette.mode === "light" ? "black" : "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {rec.product} : {rec.percentage}%
                                </Typography>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

async function fetchArRefs() {
    const apiUrl = 'https://localhost:7010/api/Prevision_articles_commandes/unique-articles';

    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching AR_Ref:', error);
        return [];
    }
}

async function fetchRecommendations(arRef) {
    const apiUrl = `https://localhost:7010/api/Prevision_articles_commandes/recommendations?arRef=${arRef}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}

export default ArticleRecommendations;
