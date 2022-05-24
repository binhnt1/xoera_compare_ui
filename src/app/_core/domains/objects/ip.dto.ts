export class IpDto {
    Ip: string;
    City: string;
    Loction: any;
    Postal: string;
    Country: string;

    public static ToEntity(item: any) {
        if (item) {
            let obj: IpDto = {
                Postal: item.postal,
                Ip: item.ip || item.query,
                City: item.city || item.regionName,
                Country: item.country || item.countryCode,
                Loction: item.loc || (item.lat + item.lon),
            };
            return obj;
        }
        return null;
    }
}