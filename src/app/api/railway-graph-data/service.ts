import {compareTime, convertTime, getRandomHexColor} from "@/app/api/railway-graph-data/helpers";
import RailwayStopTimesInterface from "@/interfaces/RailwayStopTimesInterface";

import tripsData from '@/data/trips.json';
import stopsData from '@/data/stops.json'
import stopTimesData from '@/data/stop_times.json';
import {RailwayTripsInterface} from "@/interfaces/RailwayTripsInterface";
import RailwayStopsInterface from "@/interfaces/RailwayStopsInterface";
import RailwayGraphDataSeriesInterface from "@/interfaces/RailwayGraphDataSeriesInterface";


export function getRouteTripsAndIds(id: string): [RailwayTripsInterface[], string[]] {
    const usedTripIds: string[] = [];
    return [
        tripsData
        .filter((item) => item.route_id === id)
        .map((item) => {
            usedTripIds.push(item.trip_id);
            return item;
        }),
        usedTripIds
    ];
}

export function getStopTimesAndIds(usedTripIds: string[], timeRange: string): [RailwayStopTimesInterface[], string[]] {
    const usedStopIds: string[] = [];
    const data: RailwayStopTimesInterface[] = stopTimesData as RailwayStopTimesInterface[];

    return [
        data.filter((item) => (usedTripIds.includes(item.trip_id)))
        .map(({trip_id, stop_id, arrival_time})=> {
            usedStopIds.push(stop_id);

            const item: any = {
                trip_id,
                stop_id
            };

            if(arrival_time) {
                const arrivalTimeDate = convertTime(arrival_time);

                if(compareTime(arrivalTimeDate, Number(timeRange))) {
                    item.arrival_time = arrivalTimeDate;
                }
            }

            return item;
        }),
        usedStopIds
    ]
}

export function getStops(usedStopIds: string[]): RailwayStopsInterface[] {
    return stopsData
        .filter((item) => usedStopIds.includes(item.stop_id));
}

export function getStopsIdMapping(stops: RailwayStopsInterface[]) {
    const stopsIdMapping: any = {};

    for (const stop of stops) {
        stopsIdMapping[stop.stop_id] = stop;
    }

    return stopsIdMapping;
}

export function getTimesFoYAxis(timeRange: string) {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + Number(timeRange));
    return [
        new Date(),
        endTime
    ];
}

export function getSeriesAndStations(
    stopsIdMapping: any, routeTrips: RailwayTripsInterface[],
    stopsTimes: RailwayStopTimesInterface[]
): [RailwayGraphDataSeriesInterface[], Partial<RailwayStopsInterface>[]] {
    const series: RailwayGraphDataSeriesInterface[] = [];
    const stations: Partial<RailwayStopsInterface>[] = [];

    for(const trip of routeTrips) {
        const item: RailwayGraphDataSeriesInterface = {
            ...trip,
            values: [],
            color: getRandomHexColor()
        };
        const tripTimes = stopsTimes.filter(({trip_id}) => trip_id === trip.trip_id);

        for (const tripTime of tripTimes) {
            const usedStations = stations.map(item => item.stop_name)

            if(tripTime.arrival_time) {
                item.values.push({
                    label: stopsIdMapping[tripTime.stop_id].stop_name,
                    time: tripTime.arrival_time
                });

                if(!usedStations.includes(stopsIdMapping[tripTime.stop_id].stop_name)) {
                    stations.push(stopsIdMapping[tripTime.stop_id]);
                }
            }

            if(tripTime.departure_time) {
                item.values.push({
                    label: stopsIdMapping[tripTime.stop_id].stop_name,
                    time: tripTime.departure_time
                });

                if (!usedStations.includes(stopsIdMapping[tripTime.stop_id].stop_name)) {
                    stations.push(stopsIdMapping[tripTime.stop_id].stop_name);
                }
            }
        }

        if(item.values.length > 0) {
            series.push(item);
        }
    }

    return [
        series,
        stations
    ];
}
