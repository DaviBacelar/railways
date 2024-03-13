import RailwayGraphDataSeriesLineInteface from "@/interfaces/RailwayGraphDataSeriesLineInteface";

export default interface RailwayGraphDataSeriesInterface {
    service_id: string;
    trip_id: string;
    trip_headsign: string;
    values: RailwayGraphDataSeriesLineInteface[];
    color: string;
}
