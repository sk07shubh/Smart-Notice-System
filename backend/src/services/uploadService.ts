import { randomUUID } from "crypto";
import prisma from "../config/db";
import { supabase, BUCKET_NAME, PUBLIC_URL } from "../config/storage";

export async function uploadFile(file: Express.Multer.File) {
    const key = `${randomUUID()}-${file.originalname}`;
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(key, file.buffer, { contentType: file.mimetype });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const url = `${PUBLIC_URL}/${key}`;

    const attachment = await prisma.attachment.create({
        data: {
            url,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
        },
    });

    return attachment;
}

export async function deleteAttachment(id: string) {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new Error("Attachment not found");

    await deleteStoredAttachment(attachment);
    await prisma.attachment.delete({ where: { id } });
}

export async function deleteStoredAttachment(attachment: { url: string }) {
    const key = attachment.url.replace(`${PUBLIC_URL}/`, "");
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([key]);
    if (error) throw new Error(`Upload deletion failed: ${error.message}`);
}
