"use server";

import {
  makePartialPublicPost,
  PublicPost,
  makePublicPostFromDb,
} from "@/dto/post/dto";
import { PostUpdateSchema } from "@/lib/post/queries/validations";
import { postRepository } from "@/repositories/post";
import { coverImgFormatter } from "@/utils/coverImg-formatter";
import { generateSlubByText } from "@/utils/generate-slug-by-text";
import { getZodErrorMessages } from "@/utils/get-zod-error-message";
import { revalidateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: true;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Dados inválidos"],
    };
  }

  const id = formData.get("id")?.toString() || "";

  if (!id || typeof id !== "string") {
    return {
      formState: prevState.formState,
      errors: ["ID inválido"],
    };
  }

  const formDataObj = Object.fromEntries(formData.entries());

  const zodParsedObject = PostUpdateSchema.safeParse(formDataObj);

  if (!zodParsedObject.success) {
    const errors = getZodErrorMessages(zodParsedObject.error);
    return {
      formState: makePartialPublicPost(formDataObj),
      errors,
    };
  }

  const validPostData = zodParsedObject.data;

  const newPost = {
    slug: generateSlubByText(validPostData.title),
    ...validPostData,
    coverImageUrl: coverImgFormatter(validPostData.coverImageUrl),
  };

  let post;

  try {
    post = await postRepository.updatePostById(id, newPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        formState: makePartialPublicPost(formDataObj),
        errors: [error.message],
      };
    }

    return {
      formState: makePartialPublicPost(formDataObj),
      errors: ["Erro desconhecido"],
    };
  }

  revalidateTag("posts", "max");
  revalidateTag(`post-${id}`, "max");

  return {
    formState: makePublicPostFromDb(post),
    errors: [],
    success: true,
  };
}
