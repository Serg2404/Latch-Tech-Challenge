import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { FilteringService } from '../../services/filtering.service';
import { of } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { Filter } from '../../../core/models/filter.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let filteringService: jasmine.SpyObj<FilteringService>;

  beforeEach(async () => {
    const filteringServiceSpy = jasmine.createSpyObj('FilteringService', ['getProducts', 'applyFiltersAndSearch', 'paginate', 'switchStrategy']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: FilteringService, useValue: filteringServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    filteringService = TestBed.inject(FilteringService) as jasmine.SpyObj<FilteringService>;

    filteringService.getProducts.and.returnValue(of([]));
    filteringService.applyFiltersAndSearch.and.returnValue(of({ products: [], totalItems: 0 }));
    filteringService.paginate.and.returnValue(of([]));
    filteringService.switchStrategy.and.returnValue(of(null));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products and categories on init', async () => {
    const products: Product[] = [
      {
          id: 1, name: 'Product 1', category: 'Category 1', price: 100,
          description: ''
      },
      {
          id: 2, name: 'Product 2', category: 'Category 2', price: 200,
          description: ''
      }
    ];
    filteringService.getProducts.and.returnValue(of(products));

    await component.ngOnInit();

    expect(component['products']).toEqual(products);
    expect(component.categories).toEqual(['Category 1', 'Category 2']);
    expect(component.totalItems).toBe(2);
  });

  it('should apply filters and search', () => {
    component.categoriesSelected = { 'Category 1': true };
    component.priceRangeSelected = { min: 50, max: 150 };
    component.searchTerm = 'Product';

    component.applyFiltersAndSearch();

    expect(filteringService.applyFiltersAndSearch).toHaveBeenCalledWith('Product', jasmine.any(Array), component.currentPage, component.pageSize);
  });

  it('should handle page change', () => {
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(filteringService.paginate).toHaveBeenCalledWith(2, component.pageSize);
  });

  it('should handle page size change', () => {
    component.onPageSizeChange(20);

    expect(component.pageSize).toBe(20);
    expect(component.currentPage).toBe(1);
    expect(filteringService.applyFiltersAndSearch).toHaveBeenCalled();
  });

  it('should handle search', () => {
    component.onSearch('New Search');

    expect(component.searchTerm).toBe('New Search');
    expect(component.currentPage).toBe(1);
    expect(filteringService.applyFiltersAndSearch).toHaveBeenCalled();
  });

  it('should handle category selection change', () => {
    const filterChange: Filter = {
        multiselect: { 'Category 1': true },
        type: 'multiselect',
        value: null,
        range: null,
        greater: null,
        smaller: null
    };

    component.onCategoriesSelectedChange(filterChange);

    expect(component.categoriesSelected).toEqual({ 'Category 1': true });
    expect(filteringService.applyFiltersAndSearch).toHaveBeenCalled();
  });

  it('should handle price range change', () => {
    const filterChange: Filter = {
        range: { min: 50, max: 150 },
        type: 'multiselect',
        value: null,
        greater: null,
        smaller: null,
        multiselect: null
    };

    component.onPriceRangeChange(filterChange);

    expect(component.priceRangeSelected).toEqual({ min: 50, max: 150 });
    expect(filteringService.applyFiltersAndSearch).toHaveBeenCalled();
  });
});