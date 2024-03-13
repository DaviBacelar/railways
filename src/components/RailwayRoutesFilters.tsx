'use client';
import * as React from 'react';

import {RailwayRoutesOptionsInterface} from "@/interfaces/RailwayRoutesOptionsInterface";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


interface Props {
    route: string;
    options: RailwayRoutesOptionsInterface[];
    onRouteSelected: (event: SelectChangeEvent) => void;
}

const RailwayRoutesFilters: React.FC<Props> = ({route, options, onRouteSelected}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="route-select-label" color='success'>
                Route
            </InputLabel>
            <Select
                labelId="route-select-label"
                id="route-select"
                label="Route"
                onChange={onRouteSelected}
                color='success'
                value={route}
            >
                {options.map(item => (
                    <MenuItem
                        key={item.route_id}
                        value={item.route_id}
                    >
                        {item.route_short_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default RailwayRoutesFilters;
