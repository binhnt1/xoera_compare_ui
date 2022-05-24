import { TableData } from "./table.data";

export class NavigationStateData {
    id?: number;
    prevUrl: string;
    viewer?: boolean;
    prevData?: TableData;
}