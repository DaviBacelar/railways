import * as React from 'react';
import {Fragment, useEffect} from 'react';
import {ExpandLess, ExpandMore, Visibility} from "@mui/icons-material";
import RailwayGraphDataSeriesInterface from "@/interfaces/RailwayGraphDataSeriesInterface";
import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';


interface GroupedDataInterface {
    [key: string]: RailwayGraphDataSeriesInterface[];
}

interface KeyValueInterface {
    [key: string]: boolean;
}

interface Props {
    data: RailwayGraphDataSeriesInterface[];
    onHideTrip: (trip_id: string) => void;
}

const RailwayGraphLegend: React.FC<Props> = ({data, onHideTrip}) => {
    const [groupedData, setGroupedData] = React.useState<GroupedDataInterface>({});
    const [collapsed, setCollapsed] = React.useState<KeyValueInterface>({});
    const [hidden, setHidden] = React.useState<KeyValueInterface>({});

    const handleOpenClick = (key: string) => {
        setCollapsed({
            ...collapsed,
            [key]: !collapsed[key]
        });
    };

    const handleVisibilityClick = (key: string) => {
        setHidden({
            ...hidden,
            [key]: !hidden[key]
        });

        onHideTrip(key);
    };

    useEffect(() => {
        const items: any = {};

        for (const serie of data) {
            if(!items[serie.trip_headsign]) {
                items[serie.trip_headsign] = [serie];
            } else {
                items[serie.trip_headsign].push(serie);
            }
        }

        setGroupedData(items);
    }, [data]);

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            sx={{
                marginTop: 2,
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                height: 575
            }}
        >
            {Object.keys(groupedData).map((key) => (
                <Fragment key={key}>
                    <ListItemButton onClick={() => handleOpenClick(key)}>
                        <ListItemText primary={key} />
                        {collapsed[key] ? <ExpandMore /> : <ExpandLess />}
                    </ListItemButton>
                    <Collapse in={!collapsed[key]} timeout="auto" unmountOnExit>
                        {groupedData[key]?.map(trip => (
                            <List
                                key={trip.trip_id}
                                component="div"
                                disablePadding
                            >
                                <ListItemButton
                                    sx={{ pl: 0 }}
                                    style={{
                                        fontSize: 10,
                                        color: hidden[`${trip.trip_headsign}_${trip.trip_id}`] ? '#808080' : '#000000',
                                        textDecoration: hidden[`${trip.trip_headsign}_${trip.trip_id}`] ? 'line-through' : 'none'
                                    }}
                                    onClick={() => handleVisibilityClick(`${trip.trip_headsign}_${trip.trip_id}`)}
                                >
                                    <RemoveIcon
                                        style={{
                                            color: trip.color
                                        }}
                                    />
                                        {trip.trip_headsign} | trip_id: {trip.trip_id} | service_id: {trip.service_id}
                                    <Visibility />
                                </ListItemButton>
                            </List>
                        ))}
                    </Collapse>
                </Fragment>
            ))}
        </List>
    );
}

export default RailwayGraphLegend;
