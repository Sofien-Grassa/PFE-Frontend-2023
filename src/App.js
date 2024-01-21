import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Ressources from "./scenes/ressources/ressources_matrielles";
import HistoriqueRessource from "./scenes/ressources/Historique_Ressource";
import { CssBaseline, ThemeProvider ,Box} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Employe from "./scenes/employe/employe";
import User from "./scenes/user/user";
import Login from "./scenes/login/Login";
import { useNavigate, Navigate } from 'react-router-dom';
import UserRoles from './scenes/User_Roles/UserRoles';
import axios from "axios";
import Livraison from './scenes/Livraison/livraison';
import C_A_client from './scenes/C_A_client/C_A_client';
import Calendar from "./scenes/calendar/calendar";
import ArticleRecommendations from "./scenes/prevision/prevision";

function App() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this line
    const navigate = useNavigate(); // Add this line
    const [userRoles, setUserRoles] = useState([]);
    const [userId, setUserId] = useState(null);


    // Function to handle successful login
    // App.js
    const handleLogin = async (userId) => {
        try {
            const rolesResponse = await axios.get(`https://localhost:7010/api/Login/userRoles/${userId}`);
            setUserRoles(rolesResponse.data);
            setIsLoggedIn(true);
            setUserId(userId); // Set the userId here
            navigate('/dashboard');
        } catch (error) {
            console.error('Error fetching user roles:', error);
        }
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRoles([]);
        setUserId(null);
        navigate('/login');
    };





    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {isLoggedIn ? (
                    <div className="app">
                        <div>
                            <Sidebar isSidebar={isSidebar} roles={userRoles} userId={userId} /> {/* Pass userId here */}
                            <Box
                                sx={{
                                    marginLeft: "250px", // Adjust this value according to your sidebar's width
                                    padding: "16px",
                                }}
                            >
                            </Box>
                        </div>
                        <main className="content">
                            <Topbar setIsSidebar={setIsSidebar} onLogout={handleLogout} showLogout={true} />
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Add this line */}
                                <Route path="/dashboard" element={<Dashboard roles={userRoles}/>} /> {/* Add this line */}
                                <Route path="/user" element={<User  />} />
                                <Route path="/ressources" element={<Ressources roles={userRoles} userId={userId} />} />
                                <Route path="/ressources/Historique_Ressource" element={<HistoriqueRessource roles={userRoles}  />} />
                                <Route path="/employe" element={<Employe roles={userRoles} userId={userId}  />} />
                                <Route path="/User_Roles" element={<UserRoles />} />
                                <Route path="/Livraison" element={<Livraison roles={userRoles}/>} />
                                <Route path="/C_A_client" element={<C_A_client roles={userRoles} />}  />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/prevision" element={<ArticleRecommendations />} />



                            </Routes>
                        </main>
                    </div>
                ) : (
                        <Routes>
                            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                )}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
