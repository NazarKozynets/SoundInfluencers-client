import React from 'react';
import Select, { components } from "react-select";
import checkImg from "../../../../images/icons/check.svg";

const Option = (props) => (
    <components.Option {...props} style={{ position: 'relative' }}>
        {props.isSelected && <img src={checkImg} alt="check" style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            height: 20
        }} />}
        {props.children}
    </components.Option>
);

const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>
        {children}
    </components.SingleValue>
);

const CustomSelect = ({ selectedOption, setSelectedOption, options }) => {
    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '120px',
            height: 30,
            minHeight: 30,
            borderRadius: 30,
            border: '1px solid #3330E4',
            paddingLeft: 10,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000',
            boxShadow: 'none',
            lineHeight: 'normal',
            '&:hover': {
                borderColor: '#3330E4'
            }
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: 30,
            width: 130,
            marginTop: '3px',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000',
            display: 'flex',
            alignItems: 'center'
        }),
        placeholder: (provided) => ({
            ...provided,
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000'
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: 30,
            minHeight: 30,
            padding: '0 0 2px 5px'
        }),
        input: (provided) => ({
            ...provided,
            height: 30,
            minHeight: 30,
            margin: 0,
            padding: 0
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: 30
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none'
        }),
        menuList: (provided) => ({
            ...provided,
            width: 130,
            marginTop: '0px',
            maxHeight: 137,
            borderRadius: 30,
            boxShadow: '0px 4px 20px 0px rgba(51, 48, 228, 0.50)',
        }),
        option: (provided, state) => ({
            ...provided,
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000',
            backgroundColor: state.isSelected ? '#FFFFFF' : '#FFFFFF',
            paddingLeft: state.isSelected ? '20px' : '20px',
            paddingRight: '20px',
            position: 'relative',
            '&:hover': {
                backgroundColor: '#3330E4',
                color: '#FFFFFF'
            }
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: 0,
            marginRight: 5,
            '& svg': {
                margin: 0
            }
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return (
        <Select
            value={selectedOption}  
            onChange={handleChange}
            options={options}
            styles={customStyles}
            components={{ SingleValue, Option }}
            isSearchable={false}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuShouldScrollIntoView={false}
            placeholder={"Select"}
        />
    );
};

export default CustomSelect;
