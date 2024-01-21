import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import frLocale from "@fullcalendar/core/locales/fr";
import "../../App.css";

import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "https://localhost:7010/api/Date_livraison/Calander-data"
            );
            setCalendarData(response.data);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        }
    };

    const eventContent = (args) => {
        const {
            doPiece,
            ctIntitule,
            rpCode,
            rpImmatriculation,
            emCodeTransporteur,
            emPrenom,
            emNom,
        } = args.event.extendedProps;
        return {
            html: `<div style="white-space: normal; overflow: visible; word-wrap: break-word;">
            <div>${doPiece}</div>
            <div>${ctIntitule}</div>
            <div>${rpCode}: ${rpImmatriculation}</div>
            <div>${emCodeTransporteur}: ${emPrenom} ${emNom}</div>
          </div>`,
        };
    };

    return (
        <Box
            m="20px"
            sx={{
                // Add the following styles for the buttons
                "& .fc-button:not(.fc-prev-button), .fc-button:not(.fc-next-button), .fc-button:not(.fc-today-button)": {
                    backgroundColor: theme.palette.mode === "light" ? colors.grey[600] : "inherit",
                    color: theme.palette.mode === "light" ? "black" : "inherit",
                },

                "& .fc-button-icon": {
                    fill: theme.palette.mode === "light" ? "black" : "inherit",
                },

                "& .fc-daygrid-day-top": {
                    color: theme.palette.mode === "light" ? "#14bf5b" : "inherit",
                },
                "& .fc-toolbar-title": {
                    color: theme.palette.mode === "light" ? "#1b81e1" : "inherit",
                },

                "& .fc-col-header-cell-cushion": {
                    color: theme.palette.mode === "light" ? "black" : "inherit",
                },

            }}
        >

            <Header
                title="Calendrier"
                subtitle="Page interactive du calendrier complet"
            />

            <Box display="flex" justifyContent="center">
                {/* CALENDAR */}
                <Box flex="1 1 100%" ml="15px">
                    <FullCalendar
                        locale={frLocale}
                        height="75vh"
                        plugins={[dayGridPlugin]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        moreLinkText={num => `${num} commandes`}
                        events={calendarData.map((event) => ({
                            id: event.id,
                            title: "",
                            date: event.doDateLivr,
                            doPiece: event.doPiece,
                            ctIntitule: event.ctIntitule,
                            rpCode: event.rpCode,
                            rpImmatriculation: event.rpImmatriculation,
                            emCodeTransporteur: event.emCodeTransporteur,
                            emPrenom: event.emPrenom,
                            emNom: event.emNom,
                        }))}
                        eventContent={eventContent}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;
