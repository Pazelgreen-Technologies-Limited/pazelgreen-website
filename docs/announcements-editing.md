# Site-wide announcements

In Website → Announcements, staff draft an internal title, short public message,
optional link label/URL, enabled flag, priority and optional start/end instants.
Submit for review; an admin publishes the unchanged draft. Staff cannot publish.
Draft edits keep the last approved message, link and schedule live. Disabling,
changing priority or rescheduling also requires approval. An admin can unpublish
to remove a notice immediately on the next request.

The editor shows the browser's scheduling timezone beside the date picker. Saved
dates are UTC instants. API calls must use ISO timestamps with an explicit offset;
for example, 09:00 in Lagos is `08:00Z`. End must be after start. Start is inclusive;
end is exclusive. A missing boundary means no restriction on that side.

The website shows one published, enabled, currently eligible notice. Highest
whole-number priority wins, then newest publication, then lowest internal ID.
No eligible notice means no bar. Links require both a label and a safe HTTP(S) or
site-relative URL. Internal titles and review metadata are not public.

Selection runs at request time, without a persistent page/data cache. Open pages
refresh at the next schedule boundary and at least once per minute, and refresh
when a background tab becomes visible. A network failure still hides an expired
notice locally. Newly published changes reach already open pages on their next
poll; they appear immediately on a fresh request. Client clocks/background timer
throttling can delay refresh in inactive tabs.

The bar sits above fixed navigation. Its measured height adds matching space to
the public page, including when long messages wrap on mobile. The mobile menu
scrolls within the available viewport, hides inactive links from keyboard access,
and closes after navigation. No carousel or stacked notices are supported.

`GET /api/announcements/active` returns only the chosen public display fields,
next schedule boundary and generation time, with no-store/noindex headers.
It never reads drafts, including when called by a signed-in editor. No company
notice is automatically seeded or published.
