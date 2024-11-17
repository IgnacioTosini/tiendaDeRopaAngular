// src/app/services/skeleton.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkeletonService {
  generateSkeletonItems(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
