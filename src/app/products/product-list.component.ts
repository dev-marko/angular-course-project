import { Component, OnDestroy, OnInit } from "@angular/core";
import {  Subscription } from "rxjs";

import { ProductService } from "./product.service";

import { IProduct } from "./product";

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = '';
    sub!: Subscription
    // We don't want to filter our original products array
    // because that way we lose our data
    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];
    
    constructor(private productService: ProductService) {}

    private _listFilter: string = '';

    get listFilter(): string {
        return this._listFilter;
    }

    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredProducts = this.performFilter(value);
    }

    ngOnInit(): void {
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err,
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    performFilter(filterBy: string): IProduct[] {
        filterBy = filterBy.toLowerCase();
        // If the filter string is empty, it returns all products
        return this.products.filter((item: IProduct) => item.productName.toLowerCase().includes(filterBy));
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Product List: ' + message;
    }

}