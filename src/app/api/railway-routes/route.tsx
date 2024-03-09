import { NextResponse } from 'next/server'

import data from '@/data/routes.json';
import RailwayRoutesInterface from "@/interfaces/RailwayRoutesInterface";


export async function GET() {
    try {
        const routes: Partial<RailwayRoutesInterface>[] = data.map(({route_id, route_short_name})=> ({
            route_id,
            route_short_name
        }));

        return NextResponse.json(routes);
    } catch (error) {
        return NextResponse.error();
    }
}