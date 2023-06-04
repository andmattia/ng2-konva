import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'animation',
    loadComponent: () =>
      import('./examples/animation.component').then(
        (c) => c.AnimationExampleComponent
      ),
  },
  {
    path: 'circle',
    loadComponent: () =>
      import('./examples/circle.component').then(
        (c) => c.CircleExampleComponent
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'animation' },
];
