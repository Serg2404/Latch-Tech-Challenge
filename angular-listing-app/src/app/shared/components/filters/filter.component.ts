import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Filter } from '../../../core/models/filter.model';
import { PriceRange } from '../../../core/models/price-range.model';
import { FilterType } from '../../../core/models/filter-type.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule


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

    public filterValue: string | null = null;
    public filterMin: number | null = null;
    public filterMax: number | null = null;
    public filterGreater: number | null = null;
    public filterSmaller: number | null = null;
    public filterMultiselect: Map<string, boolean>  = new Map<string, boolean>();
    public filterTypes: FilterType[] = ['value', 'range', 'greater', 'smaller', 'multiselect'];
    public showAllMultiselectOptions: boolean = false;

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
    }

    /**
     * Resets all filter values to their default states.
     * Clears the filter values, range, greater, smaller, and multiselect options.
     * Triggers the filter change event to notify about the reset.
     */
    public resetFilters() {
        this.filterValue = null;
        this.filterMin = null;
        this.filterMax = null;
        this.filterGreater = null;
        this.filterSmaller = null;
        this.filterMultiselect.clear();
        this.onFilterChange();
    }
}