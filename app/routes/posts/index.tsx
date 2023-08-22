import { Link, useLoaderData } from "@remix-run/react"


export const loader = async () => {
    const posts = [
      {
        slug: "the-remix-conf",
        title: "The remix conf 2023",
      },
      {
        slug: "the-new-era-of-apps",
        title: "The new era of the shopify apps",
      },
    ];

    const postsString = JSON.stringify({posts})
    return new Response(postsString, {
        headers: {
            'Content-Type' : "application/json"
        }
    })
}

export default function PostRoute(  ){

    const {posts} = useLoaderData()

    return (
        <main>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => {
                    return (
                        <li key={post.slug}>
                            <Link to={post.slug}>
                            {post.title}
                            </Link>
                        </li>
                    )
                })}
                </ul>
        </main>
    )
}