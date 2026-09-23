import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME as string;
export const PUBLIC_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`;
