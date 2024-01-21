import { Box, useTheme, Button, Modal, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import * as XLSX from "xlsx";

const User = () => {
    const [data, setdata] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
   


    const handleEditOpen = (user) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };
    const handleUpdateUser = (updatedUser) => {
        axios
            .put(`https://localhost:7010/api/User/update/${updatedUser.id}`, updatedUser)
            .then((result) => {
                setdata(
                    data.map((user) => (user.id === updatedUser.id ? updatedUser : user))
                );
                handleEditClose();
                toast.success("Utilisateur modifié avec succès !");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    


    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get("https://localhost:7010/api/User/Get_Users")
            .then((result) => {
                const users = result.data.map((user) => ({ id: uuidv4(), ...user }));
                setdata(users);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddUser = (user) => {
        axios.post("https://localhost:7010/api/User/Register", user)
            .then((result) => {
                setdata([...data, result.data]);
                handleClose();
                getData();
                toast.success("Utilisateur ajoute avec succès !");

            })
            .catch((error) => {
              
                    toast.error("login already exisit");
                
            });

    };
    const AddUserForm = ({ handleClose, handleAddUser }) => {
        const [newUser, setNewUser] = useState({
            userId: "",
            firstName: "",
            lastName: "",
            adresse: "",
            email: "",
            login: "",
            password: "",
        });

        const [isAdmin, setIsAdmin] = useState(false);

        const handleSubmit = (event) => {
            event.preventDefault();
            handleAddUser({ ...newUser, etat: isAdmin ? 1 : 0 });
        };

        return (
            <Box m="20px">
                <Header title="Créer un utilisateur" subtitle="Créer un profil d'utilisateur" />
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="10px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                       
                    >
                    <TextField
                        label="Prenom"
                         variant="filled"
                         fullWidth
            
                        margin="normal"
                        value={newUser.firstName}
                        onChange={(event) =>
                            setNewUser({ ...newUser, firstName: event.target.value })
                        }
                        sx={{ gridColumn: "span 2" }}

                    />
                    <TextField
                        label="Nom"
                        variant="filled"
                        fullWidth                
                        margin="normal"
                        value={newUser.lastName}
                        onChange={(event) =>
                            setNewUser({ ...newUser, lastName: event.target.value })
                        }
                        sx={{ gridColumn: "span 2" }}

                    />
                    <TextField
                        label="Adresse"
                        variant="filled"
                        fullWidth
                        margin="normal"
                            value={newUser.adresse}
                        onChange={(event) =>
                            setNewUser({ ...newUser, adresse: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}

                    />
                    <TextField
                        label="Email"
                         variant="filled"
                         type="email"
                        fullWidth
                        margin="normal"
                        value={newUser.email}
                        onChange={(event) =>
                            setNewUser({ ...newUser, email: event.target.value })
                        }
                         sx={{ gridColumn: "span 4" }}

                        />
                        <TextField
                            label="Login"
                            variant="filled"
                            required
                            type="text"
                            fullWidth
                            margin="normal"
                            value={newUser.login}
                            onChange={(event) =>
                                setNewUser({ ...newUser, login: event.target.value })
                            }
                            sx={{ gridColumn: "span 4" }}

                        />
                    <TextField
                        label="Mot de passe"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(event) =>
                            setNewUser({ ...newUser, password: event.target.value })
                        }
                         sx={{ gridColumn: "span 4" }}

                        />
                         <FormControlLabel
                control={
                    <Checkbox
                        checked={isAdmin}
                        onChange={(event) => setIsAdmin(event.target.checked)}
                        name="isAdmin"
                        color="secondary"
                    />
                }
                label="Administrateur"
                sx={{ gridColumn: "span 4" }}
            />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained">
                            ajouter un utilisateur
                        </Button> &nbsp;&nbsp;
                        <Button type="button" color="secondary" variant="contained" onClick={handleClose}>
                            Annuler
                        </Button>
                    </Box>
                </form>
            </Box>
        );
    };
    function handleDelete(id) {
        if (window.confirm("Ètes-vous sûr de vouloir supprimer cet utilsateur") == true) {
            axios.delete(`https://localhost:7010/api/User/Delete/${id}`)
                .then(() => {
                    // Remove the deleted row from the data array
                    setdata((prevData) => prevData.filter((row) => row.id !== id));
                    toast.success('utilsateur has been Delete ');

                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                });
        }
    }

    const getRowId = (row) => row.id || uuidv4();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [

        { field: "id", headerName: "ID", hide: true },
        {
            field: "userId",
            headerName: "Utilisateur_Code",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "firstName",
            headerName: "Prénom",
            flex: 1,

        },
        {
            field: "lastName",
            headerName: " Nom",
            flex: 1,
        },
        {
            field: "adresse",
            headerName: " Adresse",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "login",
            headerName: "Login",
            flex: 1,
        },
        {
            field: "password",
            headerName: "Mot de passe",
            flex: 1,
        },
        {
            field: 'etat',
            headerName: 'Etat',
            width: 10,
            renderCell: (params) => (
                <>
                    {params.value === 1 ? (
                        <AdminPanelSettingsIcon />
                    ) : (
                        <PersonIcon />
                    )}
                </>
            ),
        },

        {
            field: "Actions",
            headerName: "Actions",
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <>
                        <EditIcon onClick={() => {
                            console.log(params.row);
                            handleEditOpen(params.row);
                        }} />
                    
                    <div> 
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </>
            ),
        },

    ];
    const EditUserForm = ({ handleClose, handleUpdateUser, selectedUser }) => {
        const [editedUser, setEditedUser] = useState({ ...selectedUser });

        const handleSubmit = (event) => {
            event.preventDefault();

            // Hash the password before updating
            const hashedPassword = CryptoJS.SHA256(editedUser.password).toString(CryptoJS.enc.Base64);
            const updatedUserWithHashedPassword = { ...editedUser, password: hashedPassword };

            handleUpdateUser(updatedUserWithHashedPassword);
        };


        return (
            <Box m="20px"
            >
                    <Header title="Modifier un utilisateur" subtitle="Modifier le profil d'un utilisateur" />
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="-20px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"

                    >
                    <TextField
                        label="Prenom"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={editedUser.firstName}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, firstName: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Nom"
                        variant="filled"
                        fullWidth                 
                        margin="normal"
                        value={editedUser.lastName}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, lastName: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Adresse"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={editedUser.adresse}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, adresse: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Email"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={editedUser.email}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, email: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Login"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={editedUser.login}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, login: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Mot De Passe "
                        variant="filled"
                        fullWidth
                        required
                        margin="normal"
                        value={editedUser.password}
                        onChange={(event) =>
                            setEditedUser({ ...editedUser, password: event.target.value })
                        }
                        sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt="10px"
                    >
                    {/* Add form fields with editedUser state and setEditedUser state update function */}
                    <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                        Mettre à jour l'utilisateur
                    </Button> &nbsp;&nbsp;
                    <Button type="button" color="secondary" variant="contained" onClick={handleClose}>
                        Annuler
                        </Button>
                    </Box>
                    </Box>

                </form>
            </Box>
            );
        };
    <Modal open={editOpen} onClose={handleEditClose}>
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
            }}
        >
            <EditUserForm
                handleClose={handleEditClose}
                handleUpdateUser={handleUpdateUser}
                selectedUser={selectedUser}
            />
        </Box>
    </Modal>
    const exportUsersToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");
        XLSX.writeFile(wb, "utilisateurs.xlsx");
    };


        return (

         <Box m="20px">
                <Header title="Les utilisateurs" subtitle="La liste des utilisateurs" />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Button
                    onClick={exportUsersToExcel}
                    variant="contained"
                    style={{
                      backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
                      color: theme.palette.mode === "light" ? "black" : colors.grey[100],
                      marginTop: '-81px',
                        marginRight: '-165px',
                        borderRadius:"30px"

                    }}
                    size="medium"
                    startIcon={<SaveAltIcon />}
                  >
                    Exporter en Excel
                  </Button>
                   </div>

        <div>
          <ToastContainer />
          <Button
            variant="contained"
            style={{
              backgroundColor: theme.palette.mode === "light" ? colors.grey[800] : colors.primary[400],
              color: theme.palette.mode === "light" ? "black" : colors.grey[100],
              marginTop: '-70px',
                marginRight: '-5px',
                borderRadius:"30px"

            }}
            startIcon={<AddCircleIcon />}
            onClick={handleOpen}
          >
            Ajouter Utilisateur
          </Button>
        </div>

              


                
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                    <div>
                        <AddUserForm handleClose={handleClose} handleAddUser={handleAddUser} />
                        </div>
                    </Box>
                </Modal>
                <Modal open={editOpen} onClose={handleEditClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <EditUserForm
                            handleClose={handleEditClose}
                            handleUpdateUser={handleUpdateUser}
                            selectedUser={selectedUser}
                        />
                    </Box>
                </Modal>
            </div>
           
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
                style={{ marginTop: "-27px" }} // Add this line to move the list a little higher
            >
                <DataGrid rows={data} columns={columns} getRowId={getRowId} />
            </Box>



    </Box >
  );
};

export default User;