# Nepali Business Plan

Nepali Business is the local business and advertising area for Namaste. It should let local businesses publish small cards that can appear on the Home screen and in a full Nepali Business menu page.

## User Experience

- Home screen shows compact Nepali Business previews with featured cards.
- Sidebar/menu has a Nepali Business entry that opens the full list.
- Business cards can include photos, name, category, info, phone number, city, rating, and reviews.
- Users can call the business from the card.
- Logged-in users should later be able to post reviews.
- Home-screen advertisements should be backend controlled by position, type, priority, and active dates.
- Home-screen ad settings should control whether ads are enabled, how many ads appear, allowed ad types, and the placement slot.
- Nepali Business filters should derive type/rating options from returned ads. Location should not be a manual chip list; it should follow the Home selected location or backend location context.

## Future Backend Shape

```ts
type SuchanaPatiCard = {
  id: string;
  name: string;
  category: string;
  info: string;
  phoneNumber: string;
  photos: string[];
  city: string;
  countryCode: string;
  rating?: number;
  reviewCount?: number;
  isSponsored?: boolean;
  homePlacement?: string;
  adType?: 'inline-card' | 'featured-card' | 'compact-row' | 'banner';
  priority?: number;
  activeFrom?: string;
  activeUntil?: string;
  createdBy?: string;
};
```

## API Ideas

- `GET /api/nepali-business?city=Kathmandu&countryCode=NP`
- `GET /api/nepali-business/featured?city=Kathmandu&countryCode=NP`
- `GET /api/home-config?city=Kathmandu&countryCode=NP`
- `POST /api/nepali-business`
- `POST /api/nepali-business/{id}/reviews`
- `PATCH /api/nepali-business/{id}`
- `DELETE /api/nepali-business/{id}`

The backend should control visibility, ordering, sponsorship, and whether a card is active. The frontend placeholder data in `home.tsx` and `nepali-business.tsx` should be replaced with these APIs later.

Example home ad config:

```ts
type HomeAdConfig = {
  enabled: boolean;
  maxHomeAds: number;
  placement: string;
  allowedTypes: Array<'inline-card' | 'featured-card' | 'compact-row' | 'banner'>;
};
```
