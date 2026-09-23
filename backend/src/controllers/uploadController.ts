import { Request, Response } from "express";
import { uploadFile, deleteAttachment } from "../services/uploadService";

export async function handleUpload(req: Request, res: Response) {
    try {
        const file = (req as any).file;
        if (!file) return res.status(400).json({ error: "No file provided" });
        const attachment = await uploadFile(file);
        res.status(201).json({ data: attachment });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function handleDelete(req: Request, res: Response) {
    try {
        await deleteAttachment(req.params.id as string);
        res.status(204).send();
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}