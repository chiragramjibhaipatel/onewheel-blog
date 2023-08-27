import { redirect, type ActionFunction, type ActionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPost } from "~/models/post.server";

export const action: ActionFunction = async ({request}: ActionArgs) => {
  const body = Object.fromEntries(await request.formData());

  const errors = {
    title: body.title? null: "Title is required",
    slug: body.slug? null: "Slug is required",
    markdown: body.markdown? null : "Markdown is required"
  }

  const hasError = Object.values(errors).some(errorMessage => errorMessage)
  if(hasError){
    return json(errors)

  }
  await createPost(body);
  return redirect("/posts/admin");

}


const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`
export default function NewPostRoute() {

  const errors = useActionData();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:
          {errors?.title && <em className="text-red-800">{errors.title}</em>}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em className="text-red-800">{errors.slug}</em>}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown
          {errors?.markdown && <em className="text-red-800">{errors.markdown}</em>}
        </label>
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
