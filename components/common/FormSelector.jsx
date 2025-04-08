// // import React from "react";
// // import { Dropdown, DropdownButton } from "react-bootstrap";

// // const FormSelector = ({ onSelect }) => {
// //   return (
// //     <DropdownButton
// //       className="custom-dropdown-button"
// //       id="dropdown-basic-button"
// //       title="Add New"
// //       variant="custom"
// //     >
// //       <Dropdown.Menu className="custom-dropdown-menu">
// //         <Dropdown.Item onClick={() => onSelect("assignment")}>
// //           Assignment
// //         </Dropdown.Item>
// //         <Dropdown.Item onClick={() => onSelect("material")}>
// //           Material
// //         </Dropdown.Item>
// //         <Dropdown.Item onClick={() => onSelect("announcement")}>
// //           Announcement
// //         </Dropdown.Item>
// //         <Dropdown.Item onClick={() => onSelect("quiz")}>Quiz</Dropdown.Item>
// //       </Dropdown.Menu>
// //     </DropdownButton>
// //   );
// // };

// // export default FormSelector;

// import React from "react";
// import Select from "react-select";
// // import "./FormSelector.css"; // Import the custom CSS file if needed

// const options = [
//   { value: "assignment", label: "Assignment" },
//   { value: "material", label: "Material" },
//   { value: "announcement", label: "Announcement" },
//   { value: "quiz", label: "Quiz" },
// ];

// const FormSelector = ({ onSelect }) => {
//   const handleChange = (selectedOption) => {
//     onSelect(selectedOption.value);
//   };

//   return (
//     <Select
//       className="custom-select"
//       classNamePrefix="custom-select"
//       options={options}
//       onChange={handleChange}
//       placeholder="Add New"
//     />
//   );
// };

// export default FormSelector;

import React from "react";
import Select from "react-select";

const options = [
  { value: "assignment", label: "Assignment" },
  { value: "material", label: "Material" },
  { value: "announcement", label: "Announcement" },
  { value: "quiz", label: "Quiz" },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#dab8ffd7",
    // color: "black",
    border: "none",
    borderRadius: "0.25rem",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
  }),
  menu: (provided) => ({
    ...provided,
    width: "100%",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#586adb"
      : state.isFocused
      ? "#7e8deb"
      : "white",
    color: state.isSelected || state.isFocused ? "white" : "black",
    padding: "10px 20px",
  }),
};

const FormSelector = ({ onSelect }) => {
  const handleChange = (selectedOption) => {
    onSelect(selectedOption.value);
  };

  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={handleChange}
      placeholder="Add New"
    />
  );
};

export default FormSelector;
