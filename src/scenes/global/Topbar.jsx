import { Box, IconButton, useTheme, button } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';

const Topbar = (props) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" justifyContent="flex-end" p={2}>
            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                {props.showLogout && (
                    <IconButton onClick={props.onLogout}>
                        <LogoutIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};
export default Topbar;
