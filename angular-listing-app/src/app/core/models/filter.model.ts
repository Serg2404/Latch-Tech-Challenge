import { FilterType } from "./filter-type.model";
import { PriceRange } from "./price-range.model";
/**
 * Represents a filter used in the application.
 * 
 * @interface Filter
 * @property {string} type - The type of the filter.
 * @property {string | null} value - The value of the filter, can be null.
 * @property {PriceRange | null} range - The price range for the filter, can be null.
 * @property {number | null} greater - A number indicating the greater-than condition, can be null.
 * @property {number | null} smaller - A number indicating the smaller-than condition, can be null.
 * @property {Map<string, boolean> | null} multiselect - A map for multiselect options, can be null.
 */
export interface Filter{
    type: FilterType;
    value: string | null;
    range: PriceRange | null;
    greater: number | null;
    smaller: number | null;
    multiselect: Map<string, boolean> | null;
}