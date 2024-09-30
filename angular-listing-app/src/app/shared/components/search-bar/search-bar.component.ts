import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * @component SearchComponent
 * 
 * @description
 * A standalone Angular component that provides a search bar with debounced input.
 * It emits search terms to the parent component after a specified debounce time.
 * 
 * @selector search-bar
 * 
 * @inputs
 * - `debounceTime: number` - The debounce time in milliseconds. Default is 300ms.
 * 
 * @outputs
 * - `search: EventEmitter<string>` - Emits the search term after the debounce time.
 * 
 * @template
 * The template contains an input field for entering search terms and a button to trigger the search.
 * 
 * @styles
 * The styles define the layout and appearance of the search container, input field, and button.
 * 
 * @class SearchComponent
 * 
 * @implements OnInit, OnDestroy
 * 
 * @property {string} searchTerm - The current search term entered by the user.
 * @property {Subject<string>} searchSubject - A subject to handle the debounced search terms.
 * @property {Subscription} searchSubscription - A subscription to manage the search term stream.
 * 
 * @method ngOnInit - Initializes the component and sets up the debounced search term subscription.
 * @method ngOnDestroy - Cleans up the subscription when the component is destroyed.
 * @method onInput - Emits the current search term to the search subject.
 * @method onSearch - Immediately emits the current search term.
 */
@Component({
    selector: 'search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    public searchTerm: string = '';
    private searchSubject = new Subject<string>();
    private searchSubscription: Subscription = new Subscription;

    @Input() debounceTime: number = 300; // Default debounce time in milliseconds, can be overridden for faster/slower search
    @Output() search = new EventEmitter<string>();


    ngOnInit() {
        this.initSubscription();
    }

    ngOnDestroy() {
        this.
        searchSubscription.unsubscribe();
    }

    /**
     * Initializes the search subscription by setting up an observable
     * that listens to the searchSubject. It debounces the input events
     * based on the specified debounce time and ensures that only distinct
     * values are emitted. When a new search term is emitted, it triggers
     * the search event with the term.
     */
    initSubscription() {
        this.searchSubscription = this.searchSubject.pipe(
            debounceTime(this.debounceTime),
            distinctUntilChanged()
        ).subscribe(term => {
            this.search.emit(term);
        });
    }

    /**
     * Triggers when the input value changes and emits the current search term
     * through the searchSubject observable.
     */
    onInput() {
        this.searchSubject.next(this.searchTerm);
    }

    /**
     * Emits the current search term.
     * 
     * This method is triggered when a search action is performed.
     * It emits the `searchTerm` to notify other components or services
     * that a search has been initiated with the given term.
     */
    onSearch() {
        this.search.emit(this.searchTerm);
    }

    /**
     * Clears the current search term and emits an empty string.
     * 
     * This method is triggered when a clear action is performed.
     * It resets the `searchTerm` to an empty string and emits
     * an empty string to notify other components or services
     * that the search has been cleared.
     */
    clearSearch() {
        this.searchTerm = '';
        this.search.emit(this.searchTerm);
    }
}
