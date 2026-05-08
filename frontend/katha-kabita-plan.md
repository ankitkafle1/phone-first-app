# Katha Kabita Plan

Katha Kabita is a community writing section for Nepali and English katha, kabita, gazal, and short literary posts.

## User Experience

- Sidebar menu opens the Katha Kabita page.
- Users can browse writing cards without logging in.
- Each card shows title, writing text, content type, language, writer, published date, likes, and comments count.
- Adding katha, kabita, or gazal requires login.
- Likes and comments should later require a user session.
- Like buttons should optimistically update the UI and then call the backend once APIs exist.
- Logged-out users who tap Add writing should be sent to login.
- Posts should be searchable/filterable by text, writer, published date, and content type.

## Future Backend Shape

```ts
type KathaKabitaPost = {
  id: string;
  title: string;
  contentType: 'katha' | 'kabita' | 'gazal';
  language: 'nepali' | 'english';
  body: string;
  writer: {
    id: string;
    name: string;
  };
  publishedDate: string;
  likeCount: number;
  comments: Array<{
    id: string;
    authorName: string;
    text: string;
    createdAt: string;
  }>;
};
```

## API Ideas

- `GET /api/katha-kabita`
- `GET /api/katha-kabita?search=&writerId=&publishedDate=&contentType=`
- `POST /api/katha-kabita`
- `POST /api/katha-kabita/{id}/likes`
- `DELETE /api/katha-kabita/{id}/likes`
- `POST /api/katha-kabita/{id}/comments`
- `DELETE /api/katha-kabita/{id}`

The frontend placeholder data in `src/app/katha-kabita.tsx` should be replaced with Spring Boot APIs later. The add-writing form should stay hidden or locked until the user is logged in.
