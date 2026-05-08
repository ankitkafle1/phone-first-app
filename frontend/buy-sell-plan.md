# Buy & Sell Plan

Buy & Sell is a local classifieds section for community items.

## User Experience

- Sidebar menu opens the Buy & Sell page.
- Users can browse and search items without logging in.
- Items can be filtered by category and condition.
- Each item shows photos, title, category, condition, price, location, phone number, posted date, and description.
- Call action opens the phone prompt.
- Item creation and photo uploads should later require login.
- Items should later be filtered by the selected home city/location.
- Home visibility is controlled by `showOnHome` and `homeOrder`.

## Future Backend Shape

```ts
type ClassifiedItem = {
  id: string;
  title: string;
  category: string;
  condition: 'New' | 'Like new' | 'Used';
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photos: string[];
  postedDate: string;
  showOnHome: boolean;
  homeOrder: number;
};
```

## API Ideas

- `GET /api/buy-sell`
- `GET /api/buy-sell?search=&category=&condition=&city=`
- `POST /api/buy-sell`
- `POST /api/buy-sell/{id}/photos`
- `DELETE /api/buy-sell/{id}`

The placeholder data in `src/app/buy-sell.tsx` should be replaced with Spring Boot APIs later.
