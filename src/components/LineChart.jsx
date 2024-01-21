import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
const LineChart = ({ chartKey, isDashboard = false, data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
   

    const monthNames = [
        "",
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];
    if (data.length === 0) {
        return <div>No data available</div>;
    }

  return (
      <ResponsiveLine
          key={chartKey}
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
          stacked: false, // set stacked to false
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
          axisBottom={{
              orient: "bottom",
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0, // Faire pivoter les étiquettes de -45 degrés              tickValues: data[0]?.data.map((item) => item.x),
              format: (value) => {
                  if (value) {
                      const month = parseInt(value);
                      return `${monthNames[month]}`;
                  }
                  return ""; // Retourner une chaîne vide si la valeur n'existe pas
              },
              legend: isDashboard ? undefined : "transportation",
              legendOffset: 36,
              legendPosition: "middle",
          }}

      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
          {
          id: "linechart-legend", // Add this line
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: -30,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 110,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
