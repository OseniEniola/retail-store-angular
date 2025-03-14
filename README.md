# SavannahTechApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Features and Technologies Used

- **Angular**: Frontend framework for building dynamic and scalable applications.
- **RxJS**: Used for reactive programming to manage async data and events.
- **Karma**: Used for running unit tests in the application.
- **Debounced Search with loadash**: A product search feature with debouncing to optimize the performance of searching through a large product list.
- **Network Service**: Tracks network connectivity to provide offline and online status indicators in the application.
- **Discount Codes**: Applied a flat or percentage discount on cart items based on user input.
- **Lazy Loading**: Some modules are lazily loaded to enhance application performance.
- **Responsive Design**: The application is fully responsive across all devices (mobile, tablet, and desktop).
- **LocalStorage Caching**: Data caching using LocalStorage for better performance and offline support.
- **Angular SSR (Server-Side Rendering)**: Utilized Angular's SSR capabilities for faster page loads and better SEO optimization.
- **Reusable Components**: Modular and reusable components have been created to ensure maintainability and scalability.
- **Fake Store API**: Data for products is fetched from [https://fakestoreapi.com](https://fakestoreapi.com).
- **Cart Service**: A service for managing cart items, including adding, removing, and updating quantities of products in the cart.
- **Product Service**: A service for fetching product data from the Fake Store API.


## Setting up for Development

1. Clone the repository:
   ```bash
   git clone https://github.com/OseniEniola/retail-store-angular
   cd SavannahTechApp
