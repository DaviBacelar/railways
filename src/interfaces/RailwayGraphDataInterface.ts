import RailwayGraphDataSeriesInterface from "@/interfaces/RailwayGraphDataSeriesInterface";

export default interface RailwayGraphDataInterface {
    times: any[],
    stations: string[],
    series: RailwayGraphDataSeriesInterface[]
}
