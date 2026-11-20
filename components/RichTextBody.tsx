import Image from "next/image";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { Media, Post } from "@/payload-types";
import { inspectArticleBody, relationID, safeArticleURL } from "@/cms/blog-content";

export function RichTextBody({ body, media = [], preview = false }: { body: Post["body"]; media?: Media[]; preview?: boolean }) {
  const validation = inspectArticleBody(body);
  if (validation.error) return preview ? <p className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">{validation.error} Save corrected content to preview the article body.</p> : null;
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: ({ node }) => {
      const image = media.find(item => item.id === relationID(node.value));
      if (!image?.url) return null;
      return <figure className="my-9">
        <Image src={image.url} alt={image.alt} width={image.width || 1200} height={image.height || 800} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full rounded-xl" unoptimized />
        {(image.caption || image.attribution) && <figcaption className="mt-3 text-sm text-gray-500">{[image.caption, image.attribution].filter(Boolean).join(" — ")}</figcaption>}
      </figure>;
    },
    link: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return safeArticleURL(node.fields.url) ? <a href={node.fields.url} target={node.fields.newTab ? "_blank" : undefined} rel={node.fields.newTab ? "noopener noreferrer" : undefined}>{children}</a> : <>{children}</>;
    },
    autolink: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return safeArticleURL(node.fields.url) ? <a href={node.fields.url}>{children}</a> : <>{children}</>;
    },
  });
  return <RichText data={body} converters={converters} className="break-words text-lg leading-relaxed text-gray-700 [&_a]:text-green-800 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-green-700 [&_blockquote]:pl-6 [&_blockquote]:text-xl [&_blockquote]:text-green-950 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:leading-tight [&_h2]:text-green-950 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:mb-3 [&_h4]:mt-7 [&_h4]:text-xl [&_h4]:font-bold [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7" />;
}
