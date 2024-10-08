import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class FilterComponent implements OnInit, OnChanges {

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
    public filterMultiselect: { [key: string]: boolean } = {};
    public filterTypes: FilterType[] = ['value', 'range', 'greater', 'smaller', 'multiselect'];
    public showAllMultiselectOptions: boolean = false;
    public isSelectAllDisabled: boolean = false;

    ngOnInit() {
        this.filterMultiselect = this.initializeMultiselectOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['multiselectOptions']?.currentValue !== changes['multiselectOptions']?.previousValue) { 
            this.filterMultiselect = this.initializeMultiselectOptions();
        }
    }

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
        this.filterMultiselect = {};
        for (const key in this.filterMultiselect) {
            if (this.filterMultiselect.hasOwnProperty(key)) {
            this.filterMultiselect[key] = false;
            }
        }
        this.onFilterChange();
    }

    /**
     * Toggles the selection of all multiselect options.
     * If all options are currently selected, it will deselect all.
     * If not all options are selected, it will select all.
     */
    public toggleSelectAll() {
        this.isSelectAllDisabled = !this.isSelectAllDisabled;
        for (const key in this.filterMultiselect) {
            if (this.filterMultiselect.hasOwnProperty(key)) {
                this.filterMultiselect[key] = this.isSelectAllDisabled;
            }
        }
    }

    /**
     * Initializes the multiselect options.
     * 
     * This method creates an object where each key is an option from the 
     * `multiselectOptions` array and each value is set to `false`.
     * 
     * @returns An object with keys from `multiselectOptions` and values set to `false`.
     */
    private initializeMultiselectOptions(): { [key: string]: boolean } {
        const options: { [key: string]: boolean } = {};
        if (this.multiselectOptions) {
            this.multiselectOptions.forEach(option => {
                options[option] = false;
            });
        }
        return options;
    }
}