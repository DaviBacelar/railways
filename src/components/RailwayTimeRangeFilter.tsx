import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';


const timeSlotOptions = [
    {
        label: 'Next 2 hours',
        value: '2'
    },
    {
        label: 'Next 3 hours',
        value: '3'
    },
    {
        label: 'Next 4 hours',
        value: '4'
    },
    {
        label: 'Next 5 hours',
        value: '5'
    },
    {
        label: 'Next 6 hours',
        value: '6'
    }
];

interface Props {
    timeRange: string;
    onTimeRangePicked: (event: SelectChangeEvent) => void;
}

const RailwayTimeRangeFilter: React.FC<Props> = ({timeRange, onTimeRangePicked}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" color='success'>Time Range</InputLabel>
            <Select
                labelId="time-range-label"
                id="time-range-select"
                label="Time Range"
                value={timeRange}
                onChange={onTimeRangePicked}
                color='success'
            >
                {timeSlotOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default RailwayTimeRangeFilter;
