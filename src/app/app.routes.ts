import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'product/list' 
    },
    {
        path: 'product',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) 
    },
    {
        path: '**',
        redirectTo: 'product/list' 
    }
];
