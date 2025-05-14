import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  gameForm: FormGroup;
  timeOptions = [2, 3, 5, 7, 10];
  categories = [
    { id: 'cities', name: 'Города' },
    { id: 'countries', name: 'Страны' },
    { id: 'entertainment', name: 'Развлечения' },
    { id: 'professions', name: 'Профессии' },
    { id: 'adult', name: '18+' },
    { id: 'bodyParts', name: 'Части тела' },
    { id: 'nature', name: 'Природа' },
    { id: 'places', name: 'Места' }
  ];
  
  selectedCategories: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.gameForm = this.fb.group({
      players: [3, [Validators.required, Validators.min(3), Validators.max(11)]],
      spies: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      time: [5, Validators.required]
    });
  }

  ngOnInit() {
    // Initialize with default values
  }

  get maxSpies(): number {
    const players = this.gameForm.get('players')?.value || 3;
    // Max spies should not exceed players - 2 (need at least 2 non-spies)
    return Math.min(10, players - 2);
  }

  increasePlayer() {
    const currentValue = this.gameForm.get('players')?.value || 3;
    if (currentValue < 11) {
      this.gameForm.get('players')?.setValue(currentValue + 1);
      this.validateSpiesCount();
    }
  }

  decreasePlayer() {
    const currentValue = this.gameForm.get('players')?.value || 3;
    if (currentValue > 3) {
      this.gameForm.get('players')?.setValue(currentValue - 1);
      this.validateSpiesCount();
    }
  }

  increaseSpy() {
    const currentValue = this.gameForm.get('spies')?.value || 1;
    if (currentValue < this.maxSpies) {
      this.gameForm.get('spies')?.setValue(currentValue + 1);
    }
  }

  decreaseSpy() {
    const currentValue = this.gameForm.get('spies')?.value || 1;
    if (currentValue > 1) {
      this.gameForm.get('spies')?.setValue(currentValue - 1);
    }
  }

  validateSpiesCount() {
    const spiesControl = this.gameForm.get('spies');
    if (spiesControl && spiesControl.value > this.maxSpies) {
      spiesControl.setValue(this.maxSpies);
    }
  }

  toggleCategory(categoryId: string) {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  onSubmit() {
    if (this.gameForm.valid && this.selectedCategories.length > 0) {
      const gameSettings = {
        ...this.gameForm.value,
        categories: this.selectedCategories
      };
      console.log('Game settings:', gameSettings);
      // Navigate to game screen or start the game
      // this.router.navigate(['/game']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
} 