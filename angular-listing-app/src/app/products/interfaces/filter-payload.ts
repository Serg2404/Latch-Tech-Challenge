export interface FilterRequestPayload {
    searchTerm: string;
    currentPage: number;
    pageSize: number;
    filters: any;
}