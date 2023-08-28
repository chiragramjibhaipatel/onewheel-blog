import type { LoaderFunction } from "@remix-run/node";
import {json} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import {marked} from "marked"
import invariant from "tiny-invariant";

type LoaderData = {
  title: string
  html: string
}

export const loader: LoaderFunction = async ({params}) => {
  const {slug} = params;
  invariant(slug, `slug is not defined`)
  invariant(typeof slug === 'string', 'slug must be a string')
  const post = await getPost(slug);
  invariant(post, `post not found: ${slug}`)
  const html = marked(post?.markdown)
  return json<LoaderData>({title: post.title, html})
}

export default function PostRoute() {

  const {title, html} = useLoaderData() as LoaderData
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {title}
      </ul>
      <ul>
        <div dangerouslySetInnerHTML={{__html:html}}></div>
      </ul>
    </main>
  );
}


