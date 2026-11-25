# FreshCart (Angular 22)

Requires Node 22+.

    npm install
    npm start        # http://localhost:4200

## Structure

    src/app/
    ├── core/
    │   ├── services/      api, store (cart + wishlist state), toast
    │   ├── guards/        auth.guard
    │   ├── interceptors/  token.interceptor
    │   └── constants.ts   API url, phone regex
    ├── shared/
    │   ├── components/    product-card, field-errors
    │   ├── directives/    img-fallback
    │   └── pipes/         egp
    ├── features/
    │   ├── auth/          login, register, forgot-password, change-password, auth.service.ts
    │   ├── home/          homepage (the "dashboard" of a store)
    │   ├── products/      product-list, product-details
    │   ├── brands/        brand-list, brand-details
    │   ├── categories/    category-list, category-details
    │   ├── cart/  wishlist/  checkout/  orders/
    ├── models/            Product, Category, Brand, Cart, Order, auth payloads
    ├── app.component.ts / .html / .css
    ├── app.config.ts
    └── app.routes.ts

Import aliases (tsconfig.json): `@core/*`, `@shared/*`, `@features/*`, `@models`.

Zoneless + signals, Signal Forms, lazy routes, functional guard + token interceptor.
Online payment returns to /allorders (routed to the Orders page).
