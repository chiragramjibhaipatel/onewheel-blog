import { Link, useLoaderData } from "@remix-run/react"
import type {LoaderFunction } from "@remix-run/node"
import {json} from "@remix-run/node"
import { getPostListings } from "~/models/post.server"

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPostListings>>
}


export const loader : LoaderFunction = async () => {
    const posts = await getPostListings();

   return json<LoaderData>({posts})
}

export default function PostRoute(  ){

    const {posts} = useLoaderData() as LoaderData

    return (
        <main>
            <h1>Posts</h1> 
            <Link to="admin"  className="text-red-600 underline">Admin</Link>
            <ul>
                {posts.map(post => {
                    return (
                      <li key={post.slug}>
                        <Link prefetch="intent" to={post.slug}>
                          {post.title}
                        </Link>
                      </li>
                    );
                })}
                </ul>
        </main>
    )
}