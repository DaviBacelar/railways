'use client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {RailwayRoutesOptionsInterface} from "@/interfaces/RailwayRoutesOptionsInterface";


interface props {
    options: RailwayRoutesOptionsInterface[];
}

const RailwayRoutesFilters: React.FC<props> = ({options}) => {
    return (
        <Autocomplete
            id="filter-route-id"
            disablePortal
            options={options}
            getOptionLabel={(option) => option.route_short_name}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Route" />}
            onChange={(_, value) => {
                console.log(value);
            }}
        />
    );
}

export default RailwayRoutesFilters;
