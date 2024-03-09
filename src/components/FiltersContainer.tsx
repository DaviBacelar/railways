import Axios from "axios";
import React, {useEffect, useState} from "react";
import {Button, Grid, Paper} from "@mui/material";

import {RailwayRoutesOptionsInterface} from "@/interfaces/RailwayRoutesOptionsInterface";
import RailwayRoutesFilters from "@/components/RailwayRoutesFilters";
import {width} from "@mui/system";


export default function FiltersContainer() {
    const [options, setOptions] = useState<RailwayRoutesOptionsInterface[]>([]);

    useEffect(() => {
        Axios.get('/api/railway-routes')
            .then((res) => {
                setOptions(res.data)
            })
            .catch((error) => {
               console.error(error);
            });
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <Paper>
                    <RailwayRoutesFilters options={options} />
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Button
                    variant="contained"
                    color="success"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    Search
                </Button>
            </Grid>
        </Grid>
    )
}
