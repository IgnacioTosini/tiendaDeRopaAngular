import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ClothesStockService } from '../services/clothes-stock.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';
import { CreateClotheComponent } from '../create-clothe/create-clothe.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CreateClotheComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  searchForm: FormGroup;
  user: User = new User('', '', '', '', '', '');
  clothe: ClothesStock = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0);
  users: User[] = [];
  clothes: ClothesStock[] = [];
  role: string = '';
  roles: string[] = [];
  showCreateClothes: boolean = false;

  constructor(private fb: FormBuilder, private clothesStockService: ClothesStockService, private userService: UserService, private router: Router) {
    this.searchForm = this.fb.group({
      param1: ['', Validators.required],
      param2: ['', Validators.required]
      // Agrega más campos según los parámetros que necesites
    });
  }

  resetData() {
    this.user = new User('', '', '', '', '', '');
    this.clothe = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0);
    this.users = [];
    this.clothes = [];
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
    this.userService.createUser(user).subscribe(response => {
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
      this.user = user;
      this.role = this.userService.getUserRole();
    });
  }

  getUserByEmail(email: string) {
    this.userService.getUserByEmail(email).subscribe(user => {
      this.resetData();
      console.log(user);
      this.user = user;
      this.role = this.userService.getUserRole();
    });
  }

  getClothes() {
    this.clothesStockService.findAll().subscribe(clothes => {
      this.resetData();
      console.log(clothes);
      this.clothes = clothes;
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
      this.clothe = clothes[0];
    });
  }

  findClothesByParameters() {
    if (this.searchForm.valid) {
      this.clothesStockService.findClothesByParameters(this.searchForm.value).subscribe(clothes => {
        this.resetData();
        console.log(clothes);
        this.clothes = clothes;
      });
    }
  }

  displayCreateClothes() {
    if (this.showCreateClothes === true) {
      this.showCreateClothes = false;
    } else {
      this.showCreateClothes = true;
    }
  }
}
