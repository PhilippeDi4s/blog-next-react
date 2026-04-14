"use server";
import { fileTypeFromBuffer } from "file-type";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";
import sharp from "sharp";

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageActionResult> {
  
  const makeResult = ({ url = "", error = "" }) => ({ url, error });
  
  if (!(formData instanceof FormData)) {
    return makeResult({ error: "Dados inválidos" });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "Arquivo inválido" });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    return makeResult({ error: "Arquivo inválido ou corrompido" });
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(type.mime)) {
    return makeResult({ error: "Formato não permitido" });
  }

  const imageMaxUploadSize = Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE || 921600)

  if (file.size > imageMaxUploadSize) {
    return makeResult({ error: "Arquivo muito grande" });
  }
  const safeBuffer = await sharp(buffer).resize(800).toFormat("png").toBuffer();

  const imageExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${imageExtension}`;

  const imageUploaderDirectory = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_DIRECTORY || "uploads"

  const uploadFullPath = resolve(process.cwd(), "public", imageUploaderDirectory)

  await mkdir(uploadFullPath, { recursive: true });

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);

  await writeFile(fileFullPath, safeBuffer);

  const imageServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL || 'http://localhost:3000/uploads'

  const url = `${imageServerUrl}/${uniqueImageName}`;

  return makeResult({ url });
}