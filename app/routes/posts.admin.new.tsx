import { redirect, type ActionFunction, type ActionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigation, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost } from "~/models/post.server";


type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({request}: ActionArgs) => {
  const body = Object.fromEntries(await request.formData());
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

  await createPost({title,slug,markdown});
  return redirect("/posts/admin");

}



const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`
export default function NewPostRoute() {

  const errors = useActionData() as ActionData;

  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
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
          disabled={isSubmitting}
        >
           { isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
