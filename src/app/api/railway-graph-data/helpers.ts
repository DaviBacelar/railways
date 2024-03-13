import RailwayStopsInterface from "@/interfaces/RailwayStopsInterface";

export function getRandomHexColor(): string {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hexadecimal format
    const hex = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;

    return hex;
}

export function convertTime(timeString: string) {
    const [hour, minute, second] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    return date;
};

export function compareTime(date: Date, range: number) {
    const maxTime = new Date();
    maxTime.setHours(maxTime.getHours() + range);
    return new Date() <= date && date <= maxTime;
};


export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;  // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

interface LocationsInterface extends RailwayStopsInterface {
    distances: any[];
}

export function sortStopsByDistance(stops: any[]) {
    const locations = [...stops] as LocationsInterface[];

    locations.forEach((location, index) => {
        for (let i = 0; i < locations.length; i++) {
            if (i !== index) {
                const distance = calculateDistance(Number(location.stop_lat), Number(location.stop_lon), Number(locations[i].stop_lat), Number(locations[i].stop_lon));
                if (!location.distances) {
                    location.distances = [];
                }

                location.distances.push({
                    name: locations[i].stop_name,
                    distance: distance
                });
            }
        }
    });

// Sort locations based on their average distance to other locations
    locations.sort((a, b) => {
        const avgDistanceA = a.distances.reduce((sum, loc) => sum + loc.distance, 0) / a.distances.length;
        const avgDistanceB = b.distances.reduce((sum, loc) => sum + loc.distance, 0) / b.distances.length;
        return avgDistanceA - avgDistanceB;
    });

    return locations;
}
