import { NextResponse } from 'next/server'

import data from '@/data/routes.json';
import RailwayRoutesInterface from "@/interfaces/RailwayRoutesInterface";


export async function GET() {
    try {
        const routes: Partial<RailwayRoutesInterface>[] = data.map(({route_id, route_short_name})=> ({
            route_id,
            route_short_name
        })).sort((a, b) => {
            const numA = Number(a.route_short_name.replace('S', ''));
            const numB = Number(b.route_short_name.replace('S', ''));
            return numA - numB;
        });

        return NextResponse.json(routes);
    } catch (error) {
        return NextResponse.error();
    }
}