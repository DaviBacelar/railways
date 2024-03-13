"use client"
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Container, Divider, Grid, Typography} from "@mui/material";
import Axios from "axios";

import FiltersContainer from "@/components/FiltersContainer";
import RailwayTimetableGraph from "@/components/RailwayTimetableGraph";
import RailwayGraphDataInterface from "@/interfaces/RailwayGraphDataInterface";
import RailwayGraphLegend from "@/components/RailwayGraphLegend";
import RailwayGraphDataSeriesInterface from "@/interfaces/RailwayGraphDataSeriesInterface";
import LoadingDiv from "@/components/LoadingDiv";


export default function Home() {
    const containerRef = useRef(null);
    const [width, setWidth] = useState<number>(1000);
    const [loading, setLoading] = useState<boolean>();
    const [graphData, setGraphData] = useState<RailwayGraphDataInterface | null>(null);
    const [filteredGraphSeries, setFilteredGraphSeries] = useState<RailwayGraphDataSeriesInterface[]>([]);
    const [hiddenTrips, setHiddenTrips] = useState<string[]>([]);

    const filterPickedHandler = (routeId: string, timeRange: string) => {
        setLoading(true);

        Axios.get(`/api/railway-graph-data?id=${routeId}&timeRange=${timeRange}`)
            .then((res) => setGraphData(res.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const hideTripHandler = (value: string) => {
        setHiddenTrips([
            ...hiddenTrips,
            value
        ]);
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        })

        if(containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if(containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        }
    }, [containerRef])

    useEffect(() => {
        setHiddenTrips([]);
    }, [graphData]);

    useEffect(() => {
        setFilteredGraphSeries(graphData?.series?.filter(({trip_id, trip_headsign}) => !hiddenTrips.includes(`${trip_headsign}_${trip_id}`)) || [])
    }, [hiddenTrips]);

    return (
        <Fragment>
            <Container maxWidth="xl" style={{marginTop: '50px'}}>
              <Typography variant="h5" gutterBottom>
                  Railways Graphical Time Table
              </Typography>

              <Divider color="success" style={{marginBottom: '20px'}}/>

              <FiltersContainer
                  onFiltersPicked={filterPickedHandler}
              />

            <Grid container spacing={2}>
                <Grid ref={containerRef} item xs={9}>
                    <RailwayTimetableGraph
                        times={graphData?.times || []}
                        stations={graphData?.stations || []}
                        data={filteredGraphSeries}
                        width={width}
                        height={625}
                    />
                </Grid>
                <Grid item xs={3}>
                    <RailwayGraphLegend data={graphData?.series || []} onHideTrip={hideTripHandler} />
                </Grid>
            </Grid>
        </Container>

            {loading && <LoadingDiv />}
        </Fragment>
    );
}
