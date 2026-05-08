# Rooms Plan

Rooms is a local lease listing section for single rooms, apartments, and shared spaces.

## User Experience

- Sidebar menu opens the Rooms page.
- Users can browse lease listings without logging in.
- Each listing shows photos, title, type, price, location, phone number, availability, and description.
- Call action opens the phone prompt.
- Listings should later be filtered by the selected home city/location.
- Listing creation and photo uploads should later require login.

## Future Backend Shape

```ts
type LeaseListing = {
  id: string;
  title: string;
  listingType: 'Single room' | 'Apartment' | 'Shared space';
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photos: string[];
  availableFrom: string;
};
```

## API Ideas

- `GET /api/rooms`
- `GET /api/rooms?search=&listingType=&city=`
- `POST /api/rooms`
- `POST /api/rooms/{id}/photos`
- `DELETE /api/rooms/{id}`

The placeholder data in `src/app/rooms.tsx` should be replaced with Spring Boot APIs later.
