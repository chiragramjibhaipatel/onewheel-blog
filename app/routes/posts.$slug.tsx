import type { LoaderFunction } from "@remix-run/node";
import {json} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import {marked} from "marked"


type LoaderData = {
  post: Awaited<ReturnType<typeof getPost>>
  html: string
}

export const loader: LoaderFunction = async ({params}) => {
  const {slug} = params;
  
  const post = await getPost(slug);
  const html = marked(post?.markdown)
  return json<LoaderData>({post, html})
}

export default function PostRoute() {

  const {post, html} = useLoaderData() as LoaderData
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {post?.title}
      </ul>
      <ul>
        <div dangerouslySetInnerHTML={{__html:html}}></div>
      </ul>
    </main>
  );
}


