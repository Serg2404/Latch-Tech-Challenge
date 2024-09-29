import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Filter } from '../../../core/models/filter.model';
import { PriceRange } from '../../../core/models/price-range.model';
import { FilterType } from '../../../core/models/filter-type.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

/**
 * @component FilterComponent
 * 
 * @description
 * The `FilterComponent` is a standalone Angular component that provides various filtering options.
 * It allows users to filter data based on different criteria such as value, range, greater than, 
 * smaller than, and multiselect options.
 * 
 * @selector filter
 * 
 * @inputs
 * - `filterTypes: string[]` - An array of filter types available for selection. Default is 
 *   ['value', 'range', 'greater', 'smaller', 'multiselect'].
 * - `multiselectOptions?: Map<string, boolean>` - A map of options for multiselect filters. Default is an empty map.
 * - `rangeOptions?: PriceRange | null` - An optional range option for filtering. Default is null.
 * - `title: string` - The title of the filter component. Default is 'Filter'.
 * 
 * @outputs
 * - `filterChange: EventEmitter<any>` - Emits an event whenever the filter criteria change.
 * 
 * @properties
 * - `filterType: string` - The currently selected filter type. Default is 'value'.
 * - `filterValue: string | null` - The value for the 'value' filter type. Default is null.
 * - `filterMin: number | null` - The minimum value for the 'range' filter type. Default is null.
 * - `filterMax: number | null` - The maximum value for the 'range' filter type. Default is null.
 * - `filterGreater: number | null` - The value for the 'greater' filter type. Default is null.
 * - `filterSmaller: number | null` - The value for the 'smaller' filter type. Default is null.
 * - `filterMultiselect: Map<string, boolean> | null` - The map of selected options for the 'multiselect' filter type. Default is the provided multiselectOptions or null.
 * 
 * @methods
 * - `onFilterChange()` - Constructs a filter object based on the current filter criteria and emits the `filterChange` event.
 * - `onMultiselectChange(option: string, selected: boolean)` - Updates the multiselect options and triggers the `onFilterChange` method.
 */
@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule], // Add FormsModule here
})
export class FilterComponent {
    @Input() filterType: FilterType = 'value';
    @Input() multiselectOptions?: Array<string> | null = null;
    @Input() rangeOptions?: PriceRange | null = null;
    @Input() title: string = 'Filter';
    @Output() filterChange = new EventEmitter<Filter>();

    filterValue: string | null = null;
    filterMin: number | null = null;
    filterMax: number | null = null;
    filterGreater: number | null = null;
    filterSmaller: number | null = null;
    filterMultiselect: Map<string, boolean>  = new Map<string, boolean>();
    public filterTypes: FilterType[] = ['value', 'range', 'greater', 'smaller', 'multiselect'];

    /**
     * Handles the change in filter values and emits the updated filter object.
     * 
     * Constructs a `Filter` object based on the current filter properties and emits it using the `filterChange` event emitter.
     * The `Filter` object includes:
     * - `type`: The type of the filter.
     * - `value`: The value of the filter.
     * - `range`: An object containing `min` and `max` values if both `filterMin` and `filterMax` are not null, otherwise null.
     * - `greater`: A boolean indicating if the filter is for values greater than a certain threshold.
     * - `smaller`: A boolean indicating if the filter is for values smaller than a certain threshold.
     * - `multiselect`: A boolean indicating if the filter allows multiple selections.
     */
    public onFilterChange() {
        const filter: Filter = {
            type: this.filterType,
            value: this.filterValue,
            range: this.filterMin !== null && this.filterMax !== null ? { min: this.filterMin, max: this.filterMax } : null,
            greater: this.filterGreater,
            smaller: this.filterSmaller,
            multiselect: this.filterMultiselect
        };
        this.filterChange.emit(filter);
    }

    /**
     * Handles the change event for a multiselect option.
     *
     * @param option - The option that was selected or deselected.
     * @param selected - A boolean indicating whether the option was selected (true) or deselected (false).
     */
    public onMultiselectChange(option: string, selected: boolean) {
        this.filterMultiselect!.set(option, selected);
        this.onFilterChange();
    }

    /**
     * Handles the change in range values for filtering.
     * Updates the minimum and maximum filter values and triggers the filter change event.
     *
     * @param min - The new minimum value for the filter. Can be null.
     * @param max - The new maximum value for the filter. Can be null.
     */
    public onRangeChange(min: number | null, max: number | null) {
        this.filterMin = min;
        this.filterMax = max;
        this.onFilterChange();
    }
}