import React from "react";

const Timetable = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          color: "black",
          borderRadius: "10px 10px 0 0",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffffae",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "24px" }}>
          Timetable for Summer Season (Apr 21 ~ Aug 18)
        </h2>
      </header>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ffffffd3" }}>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Time Slot
            </th>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Monday
            </th>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Tuesday
            </th>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Wednesday
            </th>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Thursday
            </th>
            <th
              style={{
                border: "1px solid #8356ff63",
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Friday
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["7:30-9:30", "", "", "", "", "DBS 600 LAB (8:00 ~ 9:30)"],
            ["9:30-11:30", "CCP 555 (9:00 ~ 11:00)", "", "", "", ""],
            ["11:30-13:30", "", "", "DBS 600 (12:00 ~ 13:00)", "", ""],
            ["13:30-15:30", "", "", "", "CCP 555 LAB (13:30 ~ 15:00)", ""],
            ["15:30-17:30", "", "", "", "", ""],
            ["17:30-19:30", "", "", "UNX 511 (17:30 ~ 19:00)", "", ""],
          ].map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: rowIndex % 2 === 0 ? "#ffffffae" : "#ffffffd3",
                height: "100px",
              }}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: "1px solid #8356ff63",
                    padding: "12px",
                    textAlign: "center",
                    color: "#555",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button className="secondary-button mt-2" onClick={() => router.back()}>
        Back
      </button> */}
    </div>
  );
};

export default Timetable;
