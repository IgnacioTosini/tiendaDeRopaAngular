import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ClothesStockService } from '../services/clothes-stock.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { ClothesStock } from '../models/clothesStock.model';
import { CreateClotheComponent } from '../create-clothe/create-clothe.component';
import { FiltersComponent } from '../filters/filters.component';
import { ClothesListComponent } from '../clothes-list/clothes-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CreateClotheComponent, FiltersComponent, ClothesListComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  users: User[] = [];
  clothes: ClothesStock[] = [];
  roles: string[] = [];
  showCreateClothes: boolean = false;
  showUpdateClothes: boolean = false;
  nameFilter: string = '';
  typeFilter: string = '';
  minPriceFilter: number | null = null;
  maxPriceFilter: number | null = null;
  filteredClothes: ClothesStock[] = [];
  sortOrder: 'name' | 'price' | 'price-desc' | null = null;
  groupedTypes: { [key: string]: string[] } = {};
  genericTypes: string[] = [];

  constructor(private clothesStockService: ClothesStockService, private userService: UserService, private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.loadClothes();
    this.route.params.subscribe((params: any) => {
      this.typeFilter = params['type'];
      this.applyFilters();
    });
  }

  resetData() {
    this.users = [];
    this.filteredClothes = [];
    this.roles = [];
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.resetData();
      console.log(users);
      this.users = users;
      this.roles = this.userService.getUserRoles();
    });
  }

  createUser(user: any) {
    this.userService.register(user).subscribe(response => {
      this.resetData();
      console.log(response);
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(response => {
      this.resetData();
      console.log(response);
    });
  }

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe(user => {
      this.resetData();
      console.log(user);
      this.users.push(user);
      this.roles.push(this.userService.getUserRole());
    });
  }

  getUserByEmail(email: string) {
    this.userService.getUserByEmail(email, '').subscribe(user => {
      this.resetData();
      console.log(user);
      this.users.push(user);
      this.roles.push(this.userService.getUserRole());
      console.log(this.users);
      console.log(this.roles);
    });
  }

  getClothes() {
    this.clothesStockService.findAll().subscribe(clothes => {
      this.resetData();
      console.log(clothes);
      this.clothes = clothes;
      this.filteredClothes = this.clothes;
    });
  }

  createUpdateClothes(clothe: any) {
    this.clothesStockService.createUpdate(clothe).subscribe(response => {
      this.resetData();
      console.log(response);
    });
  }

  findByCode(code: string) {
    this.clothesStockService.findByCode(code).subscribe(clothes => {
      this.resetData();
      console.log(clothes);
      this.clothes.push(clothes[0]);
    });
  }

  findClothesByParameters() {
    const params = this.getFilterParams();
    console.log(params);
    this.clothesStockService.findClothesByParameters(params).subscribe(clothes => {
      this.resetData();
      console.log(clothes);
      this.clothes = clothes;
    });
  }

  setPriceRange(min: number | null, max: number | null) {
    const maxLength = 5; // set your desired max length here

    if (min !== null && min !== undefined && min.toString().length > maxLength) {
      this.minPriceFilter = Number(min.toString().slice(0, maxLength));
    } else {
      this.minPriceFilter = min;
    }

    if (max !== null && max !== undefined && max.toString().length > maxLength) {
      this.maxPriceFilter = Number(max.toString().slice(0, maxLength));
    } else {
      this.maxPriceFilter = max;
    }

    this.findClothesByParameters();
  }

  preventNumberInputCant(event: any) {
    const maxLength = 5;
    let inputField = event.target;

    if (inputField.value.length >= maxLength) {
      // prevent input if max length reached
      event.preventDefault();
    }
  }

  preventNumberInput(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  displayCreateClothes() {
    if (this.showCreateClothes === true) {
      this.showCreateClothes = false;
    } else {
      this.showCreateClothes = true;
    }
  }

  displayUpdateClothes() {
    if (this.showUpdateClothes === true) {
      this.showUpdateClothes = false;
    } else {
      this.showUpdateClothes = true;
    }
  }

  async loadClothes() {
    await this.clothesStockService.findAll().toPromise();
    this.clothes = this.clothesStockService.clothesArray;
    this.groupedTypes = this.clothes.reduce((acc: { [key: string]: string[] }, curr) => {
      if (!acc[curr.getGenericType()]) {
        acc[curr.getGenericType()] = [];
      }
      acc[curr.getGenericType()].push(curr.getSpecificType());
      return acc;
    }, {});

    for (let genericType in this.groupedTypes) {
      this.groupedTypes[genericType] = Array.from(new Set(this.groupedTypes[genericType]));
    }

    this.genericTypes = Object.keys(this.groupedTypes);
  }

  handleApplyFilters(filters: { nameFilter: string; minPriceFilter: number | null; maxPriceFilter: number | null; typeFilter: string; }) {
    this.nameFilter = filters.nameFilter;
    this.minPriceFilter = filters.minPriceFilter;
    this.maxPriceFilter = filters.maxPriceFilter;
    this.typeFilter = filters.typeFilter;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredClothes = [];

    const params = this.getFilterParams();

    this.clothesStockService.findClothesByParameters(params).subscribe(
      filteredClothes => {
        this.processFilteredClothes(filteredClothes);
      },
      error => {
        console.error('Error fetching clothes:', error);
      }
    );
  }

  getFilterParams() {
    return {
      name: this.nameFilter,
      type: this.typeFilter,
      minPrice: this.minPriceFilter,
      maxPrice: this.maxPriceFilter,
      sortOrder: this.sortOrder,
    };
  }

  filterByPrice(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.filter(clothe => {
      let price = clothe.getPrice();
      return (this.minPriceFilter == null || price >= this.minPriceFilter) &&
        (this.maxPriceFilter == null || price <= this.maxPriceFilter);
    });
  }

  processFilteredClothes(filteredClothes: ClothesStock[]) {
    this.filteredClothes = this.removeDuplicates(filteredClothes);

    if (this.typeFilter) {
      this.filteredClothes = this.filterByType(this.filteredClothes);
    }
    if (this.minPriceFilter != null || this.maxPriceFilter != null) {
      this.filteredClothes = this.filterByPrice(this.filteredClothes);
    }
    if (this.sortOrder) {
      this.filteredClothes = this.sortClothes(this.filteredClothes);
    }
  }

  removeDuplicates(clothes: ClothesStock[]): ClothesStock[] {
    return Array.from(new Set(clothes.map((c: ClothesStock) => c.getName())))
      .map((name: any) => {
        return clothes.find((c: ClothesStock) => c.getName() === name);
      })
      .filter((c: ClothesStock | undefined) => c !== undefined) as ClothesStock[];
  }

  filterByType(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.filter((c: ClothesStock) => c.getGenericType() === this.typeFilter || c.getSpecificType() === this.typeFilter);
  }

  sortClothes(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.sort((a, b) => {
      if (this.sortOrder === 'name') {
        return a.getName().localeCompare(b.getName());
      } else if (this.sortOrder === 'price') {
        return a.getPrice() - b.getPrice();
      } else if (this.sortOrder === 'price-desc') {
        return b.getPrice() - a.getPrice();
      }
      return 0;
    });
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    this.sortOrder = order;
    this.applyFilters();
  }

  getSizesForProduct(code: string): string[] {
    return this.clothes
      .filter(item => item.getCode() === code)
      .map(item => item.getSize());
  }
}
