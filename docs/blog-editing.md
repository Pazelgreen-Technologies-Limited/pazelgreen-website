# Publishing a blog article

The Blog group in Payload contains **Posts** and **Categories**. The existing
media library provides cover and inline images. The public website has a blog
listing at `/blog` and article URLs at `/blog/<slug>`.

## Prepare categories and images

Create a category with a name, URL slug and optional description. A new slug is
suggested from its name; you can edit it using lowercase letters, numbers and
single hyphens. Slugs are unique. Staff save the category as a draft, submit it
by changing its review state to **in-review**, and save again. An administrator
publishes the unchanged submitted draft.

Upload images in Media and add useful alternative text. Captions and attribution
are optional and appear beneath article images. Images follow the same review
process. Every category and image referenced by a post must have an approved
publication before the article can be published. An unpublished image or category
cannot become public by being attached to an approved post.

## Write the post

Create a post and fill in:

- **Title and slug:** the headline and its public address. The first slug is
  suggested from the headline. Later headline edits do not change the slug.
- **Excerpt:** the short summary used in the listing and the default search
  description; maximum 500 characters.
- **Public author name:** the attribution shown to readers. This is independent
  of private administrator/staff profiles.
- **Publication date:** the date shown to readers and used to order articles.
  Dates display in Africa/Lagos. This is a display date, not a scheduler; approval publishes immediately.
- **Categories and cover image:** optional references to the public libraries.
- **Body:** article text with paragraphs, headings (levels 2–4), bold, italic,
  underline, numbered/bulleted lists, quotations, links and inline images.
- **SEO:** optional search title/description. Empty fields use the article title
  and excerpt. The listing page's SEO is edited separately in Website → Page SEO.

Use the link tool for website, email, phone, relative-page or anchor links. Inline
images must come from Media; private CV uploads and arbitrary embedded HTML are
not supported. Publication validates the body, safe links and image/category
approval. Empty articles cannot be published. Body limits are 200,000 text
characters, 5,000 nodes and 30 levels of nesting.

## Preview, submit and publish

Save a draft, then use **Preview** in the editor. It opens
`/blog/preview/<post-id>`, which requires a current active staff/admin session.
The preview shows the latest saved draft, including draft images available to
that editor. It is excluded from indexing and served without shared caching.
Saving a draft does not change the public article.

The normal `/blog/<slug>` URL always uses the last approved publication, even
for signed-in editors and even if someone adds `?preview=true` to that URL.
Authenticated JSON previews are also available through
`/api/preview/posts/<id>` and `/api/preview/categories/<id>`.

When ready, set the review state to **in-review** and save. An administrator can
publish the unchanged submitted draft or return it with a note. Editing a
submitted draft invalidates the pending approval. Editing a returned draft moves
it back to draft; submit it again after making the corrections. Staff cannot
publish, unpublish or permanently delete posts/categories. Historical versions
cannot be restored directly to bypass the approval process; copy the desired
content into a new draft and submit it for review.

An administrator can unpublish an article immediately. It disappears from the
listing and its detail URL shows a not-found page; versions remain available to
editors. Approved changes appear on the next request without a rebuild. Changing
a published post or category slug changes its URL; automatic redirects are not
part of this phase.

## Public listing and images

The listing shows six posts per page, newest display date first, then newest ID
for a stable order. Category filters preserve pagination; selecting a new category
starts at page one. Empty categories give a link back to all articles. Unknown
categories, invalid page parameters, pages beyond the results and unpublished
article URLs show the blog not-found page.

Only published categories appear as filters. If an administrator later removes
or unpublishes an image/category, public relationships respect that access change
and omit it. Image URLs stay behind Payload's media permissions; the frontend
does not create a separately cached Next.js image-proxy copy. Cover/inline image
bytes cannot be replaced behind an existing approved media record; upload a new
record, update the article draft and request approval.

## Developer verification

Use the supported Node version and the disposable local test database described
in [CMS setup](cms-setup.md#test-database-and-checks). Run the following in order:

```sh
pnpm test
pnpm test:integration
pnpm test:migrations
pnpm build
pnpm test:http
pnpm exec playwright install chromium
pnpm test:browser
```

Integration tests reset only the verified local `*_test` database and create test
articles/assets. Browser checks start a separate production server on port 3102
and verify desktop/mobile listing, filters, images, keyboard access and session
protected previews. They require those integration fixtures and a fresh build.
They do not create real site content. The migration round-trip check requires
permission to create a local database; it creates a new uniquely named database,
applies the schema, runs the latest migration down/up, and removes only its own
scratch database. It does not reset the configured development/test databases.
HTTP checks use port 3101 and stop their
temporary server afterward. Run the suites sequentially because they share the
test fixtures.

To use an already installed Google Chrome instead of downloading Chromium, set
`PLAYWRIGHT_CHANNEL=chrome` before running browser tests (PowerShell:
`$env:PLAYWRIGHT_CHANNEL = "chrome"`; Git Bash:
`PLAYWRIGHT_CHANNEL=chrome pnpm test:browser`). CI installs Chromium and runs
these tests. Screenshots and failure traces stay in ignored `test-results/`.
The migration, generated types and admin import map must accompany this feature.

No real articles/categories have been seeded. Initial approved content and image
rights/attribution remain part of launch preparation.
