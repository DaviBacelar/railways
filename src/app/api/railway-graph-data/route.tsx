import {NextRequest, NextResponse} from 'next/server'
import RailwayGraphDataInterface from "@/interfaces/RailwayGraphDataInterface";
import {sortStopsByDistance} from "@/app/api/railway-graph-data/helpers";
import {
    getRouteTripsAndIds,
    getSeriesAndStations,
    getStops,
    getStopsIdMapping,
    getStopTimesAndIds,
    getTimesFoYAxis
} from "@/app/api/railway-graph-data/service";


export async function GET(
    req: NextRequest
) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        const timeRange = req.nextUrl.searchParams.get('timeRange');

        if (!id || !timeRange) {
            return NextResponse.error();
        }

        const [routeTrips, usedTripIds] = getRouteTripsAndIds(id)
        const [stopsTimes, usedStopIds] = getStopTimesAndIds(usedTripIds, timeRange);
        const stops = getStops(usedStopIds);
        const stopsIdMapping = getStopsIdMapping(stops);
        const [series, stations] = getSeriesAndStations(stopsIdMapping, routeTrips, stopsTimes);

        const graphData: RailwayGraphDataInterface = {
            times: getTimesFoYAxis(timeRange),
            stations: sortStopsByDistance(stations).map(item => item.stop_name),
            series
        };

        return NextResponse.json(graphData);
    } catch (error) {
        return NextResponse.error();
    }
}
