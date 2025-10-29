<div align="center">
  
# @martin.xyz/react-router-next

## Next.JS routing convention for React Router V7

<br/>
</div>

## Setting up

First install the `react-router-next-routes` package:

```
npm i @martin.xyz/react-router-next
```

Then use it to provide route config in your `app/routes.ts` file:

```ts
import { type RouteConfig } from "@react-router/dev/routes";
import { nextRoutes } from "@martin.xyz/react-router-next";

export default nextRoutes() satisfies RouteConfig;
```

## Why?

React Router already provides a [file-system routing library](https://github.com/remix-run/react-router/tree/main/packages/react-router-fs-routes) but has a really different philosophy by constructing URLs using filename rather than directory name.

This library offers a file-system routing that is really similar to Next.JS App Router.

> [!WARNING]
> As routing capabilities are different between React Router and Next.JS this is not a drop-in replacement.

## Usage

Each folder correspond to an URL segment, and `page.tsx` correspond to the page for that URL.

```ascii
app/
├── routes/
│   ├── about/
│   │   └── page.tsx
│   └── page.tsx
└── root.tsx
```

| URL      | Layouts | Page                        |
| -------- | ------- | --------------------------- |
| `/`      |         | `app/routes/page.tsx`       |
| `/about` |         | `app/routes/about/page.tsx` |

Note that these routes will be rendered in the outlet of `app/root.tsx` because of [nested routing](https://reactrouter.com/start/framework/routing#nested-routes).

### Layouts

Each folder can contain a `layout.tsx` which will become the layout for all elements within this folder.

```ascii
app/
├── routes/
│   ├── about/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── root.tsx
```

| URL      | Layouts                                                  | Page                        |
| -------- | -------------------------------------------------------- | --------------------------- |
| `/`      | `app/routes/layout.tsx`                                  | `app/routes/page.tsx`       |
| `/about` | `app/routes/layout.tsx` -> `app/routes/about/layout.tsx` | `app/routes/about/page.tsx` |

Note that the difference with Next.JS is that `children` are rendered using `<Outlet />`.

### Dynamic Segments

You can have dynamic segments using the `[segmentName]` notation:

```ascii
app/
├── routes/
│   ├── [userId]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── root.tsx
```

| URL     | Layouts                                                     | Page                           |
| ------- | ----------------------------------------------------------- | ------------------------------ |
| `/`     | `app/routes/layout.tsx`                                     | `app/routes/page.tsx`          |
| `/4832` | `app/routes/layout.tsx` -> `app/routes/[userId]/layout.tsx` | `app/routes/[userId]/page.tsx` |

### Splat Routes (catch-all)

Splat routes can be defined using the `[...]` notation:

```ascii
app/
├── routes/
│   ├── [...]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── root.tsx
```

| URL                 | Layouts                                                  | Page                        |
| ------------------- | -------------------------------------------------------- | --------------------------- |
| `/`                 | `app/routes/layout.tsx`                                  | `app/routes/page.tsx`       |
| `/test`             | `app/routes/layout.tsx` -> `app/routes/[...]/layout.tsx` | `app/routes/[...]/page.tsx` |
| `/test/hello/world` | `app/routes/layout.tsx` -> `app/routes/[...]/layout.tsx` | `app/routes/[...]/page.tsx` |

> [!IMPORTANT]
> React Router does not have the ability to have named catch-all segments and it is not possible to have nested routes under a splat route.

### Route Groups

Route groups allows you to organize your code without changing the URL.

```ascii
app/
├── routes/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── layout.tsx
└── root.tsx
```

| URL      | Layouts                                                        | Page                               |
| -------- | -------------------------------------------------------------- | ---------------------------------- |
| `/`      | `app/routes/layout.tsx` -> `app/routes/(dashboard)/layout.tsx` | `app/routes/(dashboard)/page.tsx`  |
| `/login` | `app/routes/layout.tsx` -> `app/routes/(auth)/layout.tsx`      | `app/routes/(auth)/login/page.tsx` |
