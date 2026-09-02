# PrepRoute — Test Management App

A 5-page test-authoring tool: log in, browse a
dashboard of tests, create/edit test details, author MCQ questions, and publish.

## Getting started

```bash
npm install
npm run dev
```

The app talks to `https://admin-moderator-backend-staging.up.railway.app/api` by default. To
point at a different backend, create a `.env.local` file:

```bash
VITE_API_BASE_URL=https://your-backend/api
```

> **Network note:** this backend host does not resolve on some networks (the task brief calls
> out Jio specifically). If login or any list appears to hang/fail immediately, try a different
> network before assuming the app is broken — the login form and every data view have explicit
> error states for this.

Test credentials: `vedant-admin` / `vedant123`.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) and produce a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## App flow

1. **Login** (`/login`) — JWT stored via a persisted Zustand store; axios attaches it to every
   request and clears it on a 401.
2. **Dashboard** (`/dashboard`) — table of tests with search/status filtering, `+ Create New Test`.
3. **Create Test** (`/tests/new`) — the test-detail form (subject → topics → sub-topics cascading
   selects, marking scheme, difficulty, duration). The same form re-appears as an **Edit Test
   creation** modal from within the question workspace.
4. **Add Questions** (`/tests/:testId/questions`) — a workspace: a question-list sidebar, a
   Tiptap-based question/solution editor, 4 options with a correct-answer radio, per-question
   settings, CSV bulk import, and Next/Publish actions that persist everything to the API.
5. **Preview & Publish** (`/tests/:testId/publish`) — expandable question preview (correct answers
   highlighted), Publish Now / Schedule Publish, and a Live Until duration picker.

## Project layout

```
src/
  api/            axios instance + one module per resource
  types/          shared API types
  store/          zustand stores (auth, question drafts, toasts)
  hooks/          React Query hooks wrapping the api/ modules
  components/ui/  design-system primitives (Button, Select, Modal, RichTextEditor, ...)
  components/layout/  app shell + route guard
  features/       one folder per page/flow (auth, dashboard, testForm, questions, publish)
```


<img width="1791" height="1025" alt="Screenshot 2026-08-25 at 6 35 47 PM" src="https://github.com/user-attachments/assets/006e65c1-13c2-4974-a772-8803fd235552" />
<img width="1791" height="552" alt="Screenshot 2026-08-25 at 6 40 53 PM" src="https://github.com/user-attachments/assets/8e185b24-96f0-4646-8599-713f24b03704" />
<img width="1794" height="1026" alt="Screenshot 2026-08-25 at 6 42 10 PM" src="https://github.com/user-attachments/assets/716b6b67-7c19-48f4-a0a2-717a6bd4d08e" />
<img width="1792" height="1016" alt="Screenshot 2026-08-25 at 6 42 49 PM" src="https://github.com/user-attachments/assets/5274f22e-4a9d-4971-9d01-00e3cc2cc403" />
<img width="1788" height="1028" alt="Screenshot 2026-08-25 at 6 43 01 PM" src="https://github.com/user-attachments/assets/def418fb-4540-4d20-bb73-9abd22c45eb1" />
<img width="1798" height="1025" alt="Screenshot 2026-08-25 at 6 43 11 PM" src="https://github.com/user-attachments/assets/29fd13ca-edff-43e0-843c-fb4f411e33f3" />


