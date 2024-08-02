import React, {useEffect, useState} from 'react';
import Select, { components } from 'react-select';
import './offersSortMenu.css';
import checkImg from '../../../../images/icons/check.svg';

const OffersSortMenu = ({ selectedOption, onSortChange }) => {
    const options = [
        { value: 'Best Match', label: 'Best Match' },
        { value: 'Lowest Price', label: 'Lowest Price' },
        { value: 'Highest Price', label: 'Highest Price' },
        { value: 'Lowest Followers', label: 'Lowest Followers' },
        { value: 'Highest Followers', label: 'Highest Followers' }
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 'auto',
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
            width: 222,
            maxHeight: 212,
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
            padding: 0
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
            width: 222,
            height: 212,
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
        })
    };

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
            <span className="sort-prefix">Sort: </span>
            {children}
        </components.SingleValue>
    );

    const handleChange = (selectedOption) => {
        onSortChange(selectedOption.value);
    }

    return (
        <div className="sort-menu">
            <Select
                value={options.find(option => option.value === selectedOption)}
                onChange={handleChange}
                options={options}
                styles={customStyles}
                components={{ SingleValue, Option }}
                placeholder="Sort:"
                isSearchable={false}
            />
        </div>
    );
};

export default OffersSortMenu;