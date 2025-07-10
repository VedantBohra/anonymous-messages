# 🕵️‍♂️ Anonymous Messages App

Live demo: [https://anonymous-messages-eta.vercel.app/](https://anonymous-messages-eta.vercel.app/)

A simple and elegant Next.js app where users can receive completely anonymous feedback from anyone. Users can toggle whether they want to accept messages and share their personal link — no login required for senders.

---

## 🚀 Getting Started

### Development

To start the development server:

```bash
npm install
npm run dev
```

### Production

To build the app for production:

```bash
npm run build
npm start
```

---

## 🌐 Website Flow

1. Users log in using **NextAuth**.
2. Upon login, they are given a **unique sharable link**.
3. This link can be shared with anyone — **even if they're not registered**.
4. Visitors can send **anonymous messages** via that link.
5. Users can **enable/disable** message reception.
6. AI-powered suggestions (via Cohere) are optionally shown on the anonymous message page.

---

## 🌱 Environment Variables

Create a `.env` file in the root of your project with the following keys:

```env
DATABASE_URL=your_postgres_connection_url
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
COHERE_API_KEY=your_cohere_api_key
```

---

## 🛠️ Tech Stack

- **Next.js 13+** (App Router)
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js** for authentication
- **Resend** for email (optional)
- **Cohere API** for AI-based suggestions
- **Vercel** for deployment

---

## 🙌 Acknowledgements

Built with ❤️ to help users receive honest feedback — anonymously and securely.
