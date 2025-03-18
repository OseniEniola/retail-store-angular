import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CartWidgetComponent } from "./components/cart-widget/cart-widget.component";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [NavBarComponent,FooterComponent,ProductCardComponent,LoadingSpinnerComponent,CartWidgetComponent],
  imports: [
    CommonModule,
    FormsModule,
],
  exports: [NavBarComponent,FooterComponent,ProductCardComponent,LoadingSpinnerComponent,CartWidgetComponent,FormsModule]
})
export class SharedModule { }
