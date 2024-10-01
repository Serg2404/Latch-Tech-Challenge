import { FilterType } from "../../core/models/filter-type.model";


export interface FilterRequestPayload {
    searchTerm: string;
    currentPage: number;
    pageSize: number;
    filters: any;
}