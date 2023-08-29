import { redirect, type ActionFunction, type ActionArgs, json, type LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost, deletePost, getPost, updatePost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
  post: Awaited<ReturnType<typeof getPost>>
}

export const loader: LoaderFunction =async ({request, params}) => {
  await requireAdminUser(request);
  if(params.slug === 'new'){
    return json({});
  }
  const post = await getPost(params.slug);
  return json<LoaderData>({post});
}

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({request, params}: ActionArgs) => {
  await requireAdminUser(request)
  const body = Object.fromEntries(await request.formData());
  if(body.intent === "delete"){
    console.log("Deleting");
    await deletePost(params.slug);
    
    return redirect("/posts/admin");
  }
  const {title, slug, markdown} = body
  const errors : ActionData = {
    title: title? null: "Title is required",
    slug: slug? null: "Slug is required",
    markdown: markdown? null : "Markdown is required"
  }

  const hasError = Object.values(errors).some(errorMessage => errorMessage)
  if(hasError){
    return json<ActionData>(errors)

  }
  invariant(typeof title === 'string', 'title must be a string')
  invariant(typeof slug === 'string', 'slug must be a string')
  invariant(typeof markdown === 'string', 'markdown must be a string')

  if(params.slug === 'new'){
    await createPost({title,slug,markdown});
  } else {
    console.log("Updateing...", {title, slug, markdown});
    await updatePost(params.slug, {title, slug, markdown})
  }

  return redirect("/posts/admin");

}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`
export default function NewPostRoute() {

  const errors = useActionData() as ActionData;
  const {post} = useLoaderData() as LoaderData;
  const isNewPost = !post;

  const navigation = useNavigation()
  const isCreating = navigation.formData?.get("intent") === "create";
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isDeleting = navigation.formData?.get("intent") === "delete";

  return (
    <Form method="post" key={post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:
          {errors?.title && <em className="text-red-800">{errors.title}</em>}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em className="text-red-800">{errors.slug}</em>}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={post?.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown
          {errors?.markdown && (
            <em className="text-red-800">{errors.markdown}</em>
          )}
        </label>
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={post?.markdown}
        />
      </p>
      <div className="flex justify-end gap-4">
        {isNewPost ? null : (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white"
            disabled={isDeleting}
          >
            {isDeleting? "Deleting...": "Delete"}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 py-2 px-4 text-white"
          disabled={isCreating || isUpdating}
        >
          {isNewPost
            ? isCreating
              ? "Creating..."
              : "Create Post"
            : isUpdating
            ? "Updarint..."
            : "Update Post"}
        </button>
      </div>
    </Form>
  );
}
