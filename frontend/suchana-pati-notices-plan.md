# Suchana Pati Notices Plan

Suchana Pati is the community notice board for announcements, events, alerts, and local information.

## User Experience

- Sidebar menu opens the Suchana Pati notices page.
- Users can browse notices without logging in.
- Notices can be searched and filtered by type.
- Each notice shows title, type, location, date, organizer, and description.
- Notices should later follow the selected home location or backend location context.

## Future Backend Shape

```ts
type NoticePost = {
  id: string;
  title: string;
  noticeType: 'Announcement' | 'Event' | 'Community' | 'Alert';
  location: string;
  dateLabel: string;
  organizer: string;
  description: string;
};
```

## API Ideas

- `GET /api/suchana-pati`
- `GET /api/suchana-pati?search=&noticeType=&city=`
- `POST /api/suchana-pati`
- `PATCH /api/suchana-pati/{id}`
- `DELETE /api/suchana-pati/{id}`
