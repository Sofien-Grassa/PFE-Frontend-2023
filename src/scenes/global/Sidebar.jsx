import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import TableRowsIcon from '@mui/icons-material/TableRows';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useEffect, useState } from "react";
import axios from "axios";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ roles, userId }) => { // Receive the userId prop here
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userName, setUserName] = useState("Admin");
  const CanViewGU = roles.some(role => role.codeRole === "gu");
  const CanViewLR = roles.some(role => role.codeRole === "lr");
  const CanViewLC = roles.some(role => role.codeRole === "lc");
  const CanViewLCO = roles.some(role => role.codeRole === "lco");
  const CanViewLCAC = roles.some(role => role.codeRole === "lcac");
  const CanViewHR = roles.some(role => role.codeRole === "hr");
  const CanViewPAR = roles.some(role => role.codeRole === "par");
  const CanViewCAL = roles.some(role => role.codeRole === "cal");


    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get(`https://localhost:7010/api/User/User_Name?userId=${userId}`);
                setUserName(response.data);
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };
        if (userId) { // Only fetch the user name if userId is not null
            fetchUserName();
        }
    }, [userId]); 

  return (
      <Box
          sx={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              overflowY: "auto",
              zIndex: 1000,
              "& .pro-sidebar-inner": {
                  background: `${colors.primary[400]} !important`,
              },
              "& .pro-icon-wrapper": {
                  backgroundColor: "transparent !important",
              },
              "& .pro-inner-item": {
                  padding: "5px 35px 5px 20px !important",
              },
              "& .pro-inner-item:hover": {
                  color: "#868dfb !important",
              },
              "& .pro-menu-item.active": {
                  color: "#6870fa !important",
              },
          }}
      >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography/>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                                  src={`../../assets/sobig.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                 SOBIG
                 </Typography>

                <Typography variant="h5" color={colors.greenAccent[500]}>
                                  {userName}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

                      {CanViewGU && (
                          <>
                              <Typography
                                  variant="h6"
                                  color={colors.grey[300]}
                                  sx={{ m: "15px 0 5px 20px" }}
                              >
                                  Gestion des utilisateurs
                              </Typography>
                              <Item
                                  title="Liste des utilisateurs"
                                  to="/user"
                                  icon={<TableRowsIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                              <Item
                                  title="Gestion de droit d'acées"
                                  to="/User_Roles"
                                  icon={<VpnKeyIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                          </>
                      )}
                       <Typography
                          sx={{ m: "15px 0 5px 20px" }}
                      />

                      
                          
                              <Typography
                                  variant="h6"
                                  color={colors.grey[300]}
                                  sx={{ m: "15px 0 5px 20px" }}
                              >
                                  Gestion des ressources
                          </Typography>
                      {CanViewLR && (
                          <>
                              <Item
                                  title="Liste des ressources"
                                  to="/ressources"
                                  icon={<TableRowsIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                          </>)}
                      {CanViewHR && (
                          <>
                      <Item
                          title="L'historique des ressources"
                          to="/ressources/Historique_Ressource"
                          icon={<TableRowsIcon />}
                          selected={selected}
                          setSelected={setSelected}
                              />
                          </>)}
                     
                      {CanViewLC && (
                          <>
                              <Item
                                  title="Liste des employés"
                                  to="/employe"
                                  icon={<TableRowsIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                          </>
                      )}
                      <Typography
                          sx={{ m: "15px 0 5px 20px" }}
                      />
                      <Typography
                          variant="h6"
                          color={colors.grey[300]}
                          sx={{ m: "15px 0 5px 20px" }}
                      >
                          Gestion commerciale
                      </Typography>
                      {CanViewLCO && (
                          <>
                              <Item
                                  title="Liste des commandes"
                                  to="/Livraison"
                                  icon={<TableRowsIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                          </>
                      )}
                      {CanViewPAR && (
                          <>
                              <Item
                                  title="Prévision des articles recommandés"
                                  to="/prevision"
                                  icon={<img src="/assets/prevision.png" alt='my image' style={{ width: '24px', height: '24px' }} />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />

                          </>
                      )}
                      {CanViewLCAC && (
                          <>
                              <Item
                                  title="Liste des chiffre d'affaire client"
                                  to="/C_A_client"
                                  icon={<TableRowsIcon />}
                                  selected={selected}
                                  setSelected={setSelected}
                              />
                          </>
                      )}
                      {CanViewCAL && (
                      <Item
                          title="Calendrier"
                          to="/calendar"
                          icon={<CalendarTodayOutlinedIcon />}
                          selected={selected}
                          setSelected={setSelected}
                          />
                      )}
          
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
