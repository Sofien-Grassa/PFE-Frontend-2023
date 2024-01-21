import React, { useState, useEffect } from 'react';
import { FormControl, FormGroup, FormControlLabel, InputLabel, Box,MenuItem, Select, Checkbox,Container,Grid, Paper, Typography,} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme, styled } from '@mui/system';
import Header from "../../components/Header";
import { tokens } from "../../theme";


const UserRoles = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);

    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.54)', // Adjust the color based on the theme mode
        '&.Mui-checked': {
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main, // Set the checked color based on the theme mode
        },
    }));


    useEffect(() => {
        // Replace these functions with your own API calls
        fetchUsers().then(setUsers);
        fetchRoles().then(setRoles);
    }, []);

    const handleRoleChange = (event, codeRole) => {
        if (event.target.checked) {
            setSelectedRoles([...selectedRoles, codeRole]);
            addUserRole(selectedUser, codeRole);
        } else {
            setSelectedRoles(selectedRoles.filter((role) => role !== codeRole));
            removeUserRole(selectedUser, codeRole); // Call the removeUserRole function here
        }
    };

    return (
        <Container>
            <Box m="20px">
                <Header title="Les Rôles" subtitle=" Gestion des rôles utilisateurs" />
            </Box>
            <ToastContainer />
            <Grid container spacing={3}>
                
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : " colors.primary[400]",
                            color: theme.palette.mode === "light" ? "colors.grey[800]" : "inherit",
                            borderRadius:"30px" 

                        }}
                    >
                    <FormControl fullWidth>
                            <InputLabel
                                id="user-select-label"
                                sx={{
                                    color: theme.palette.mode === "light" ? "#1b81e1" : "#1bcde1",
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    transform: selectedUser ? 'translate(12px, -20px) scale(0.75)' : '',
                                    '&.Mui-focused, &.MuiInputLabel-filled': {
                                        transform: 'translate(12px, -20px) scale(0.75)',
                                    },
                                }}
                            >
                                Utilisateur
                            </InputLabel>

                        <Select
                            labelId="user-select-label"
                            value={selectedUser}
                            onChange={async (e) => {
                                setSelectedUser(e.target.value);
                                const userRoles = await fetchUserRoles(e.target.value);
                                setSelectedRoles(userRoles);
                                }}
                                renderValue={(selected) => {
                                    // Trouver l'utilisateur sélectionné dans le tableau d'utilisateurs
                                    const user = users.find((user) => user.userId === selected);
                                    // Retourner le prénom et le nom de l'utilisateur sélectionné
                                    return `${user.firstName} ${user.lastName}`;
                                }}
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user.id}
                                    value={user.userId}
                                    sx={{
                                        color: theme.palette.mode === "light" ? "black" : "inherit",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user.userId}: {user.firstName} {user.lastName}
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
                            backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : " colors.primary[400]",
                            color: theme.palette.mode === "light" ? "colors.grey[800]" : "inherit",
                            borderRadius: "30px" 

                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h3"
                            gutterBottom
                            sx={{
                                color: theme.palette.mode === "light" ? "#1b81e1" : "#1bcde1",
                                fontWeight: "bold",
                            }}
                        >
                            Rôles
                        </Typography>
                        <FormGroup>
                            {roles.map((role) => (
                                <FormControlLabel
                                    key={role.codeRole}
                                    control={
                                        <CustomCheckbox
                                            checked={selectedRoles.includes(role.codeRole)}
                                            onChange={(e) =>
                                                handleRoleChange(e, role.codeRole)
                                            }
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="h5" // Change the variant for the desired size
                                            sx={{
                                                color: theme.palette.mode === "light" ? "black" : "inherit",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {role.nomRole}
                                        </Typography>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
// Replace these functions with your own API calls
async function fetchUsers() {
  
    const apiUrl = 'https://localhost:7010/api/User_Roles/Users?etat=0';

    try {
        const response = await axios.get(apiUrl);
        return response.data; // Renvoie les données reçues de l'API
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Renvoie un tableau vide en cas d'erreur
    }
}

async function fetchRoles() {
    // Fetch all roles
    try {
        const response = await axios.get("https://localhost:7010/api/User_Roles/Roles");
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
}
async function addUserRole(userId, codeRole) {
    // Insert selected user and role into the user_roles table
    try {
        const response = await axios.post(`https://localhost:7010/api/User_Roles/Add_User_Role?userId=${userId}&codeRole=${codeRole}`);
        if (response.status === 201) {
            toast.success("Rôle ajouté avec succès");
            return true;
        } else {
            console.error("Error adding role:", response);
            return false;
        }
    } catch (error) {
        // Check for specific error status or message indicating a duplicate user-role pair
        if (error.response && error.response.status === 400 && error.response.data.includes("This user already has the specified role.")) {
            toast.error("This user already has the specified role.");
            return false;
        } else if (error.response && error.response.status === 500) {
            console.error("Server error:", error.response.data); // Log the error message from the server
            toast.error("An error occurred on the server.");
        } else {
            console.error("Error adding role:", error);
        }
        return false;
    }
}

async function fetchUserRoles(userId) {
    try {
        const response = await axios.get(`https://localhost:7010/api/User_Roles/User_Roles?userId=${userId}`);
        if (response.status === 200) {
            const userRoles = response.data.map((userRole) => userRole.codeRole);
            return userRoles;
        } else {
            console.error("Error fetching user roles:", response);
            return [];
        }
    } catch (error) {
        console.error("Error fetching user roles:", error);
        return [];
    }
}
async function removeUserRole(userId, codeRole) {
    // Delete the selected user and role from the user_roles table
    try {
        const response = await axios.delete(`https://localhost:7010/api/User_Roles/Delete_User_Role?userId=${userId}&codeRole=${codeRole}`);
        if (response.status === 200) {
            toast.success("Rôle supprimé avec succès");
            return true;
        } else {
            console.error("Error removing role:", response);
            return false;
        }
    } catch (error) {
        console.error("Error removing role:", error);
        return false;
    }
}


export default UserRoles;