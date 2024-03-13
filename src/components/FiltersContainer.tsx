import Axios from "axios";
import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, Paper} from "@mui/material";

import {RailwayRoutesOptionsInterface} from "@/interfaces/RailwayRoutesOptionsInterface";
import RailwayRoutesFilters from "@/components/RailwayRoutesFilters";
import RailwayTimeRangeFilter from "@/components/RailwayTimeRangeFilter";
import {SelectChangeEvent} from "@mui/material/Select";
import LoadingDiv from "@/components/LoadingDiv";

interface Props {
    onFiltersPicked: (routeId: string, timeRange: string) => void;
}

const FiltersContainer: React.FC<Props> = ({onFiltersPicked}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [railwayRoute, setRailwayRoute] = useState<string>('1');
    const [railwayRoutesOptions, setRailwayRoutesOptions] = useState<RailwayRoutesOptionsInterface[]>([]);
    const [timeRange, setTimeRange] = useState<string>('2');

    useEffect(() => {
        setLoading(true);

        Axios.get('/api/railway-routes')
            .then((res) => {
                setRailwayRoutesOptions(res.data);
                setRailwayRoute(res.data[0].route_id);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
                onFiltersPicked(railwayRoute, timeRange);
            })
    }, []);

    const railwayRouteSelectedHandler = (event: SelectChangeEvent) => {
        setRailwayRoute(event.target.value);
    }

    const timeChangeHandler = (event: SelectChangeEvent) => {
        setTimeRange(event.target.value);
    };

    return (
        <Fragment>
            {!loading ?
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper>
                            <RailwayRoutesFilters
                                route={railwayRoute}
                                options={railwayRoutesOptions}
                                onRouteSelected={railwayRouteSelectedHandler}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Paper>
                            <RailwayTimeRangeFilter
                                timeRange={timeRange}
                                onTimeRangePicked={timeChangeHandler}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            color="success"
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            onClick={() => {
                                if(railwayRoute) {
                                    onFiltersPicked(railwayRoute, timeRange)
                                }
                            }}
                            disabled={!railwayRoute || !timeRange}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid> :
                <LoadingDiv />
            }
        </Fragment>
    )
}

export default FiltersContainer;
