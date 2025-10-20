import { supabase } from "../databases/supabaseClient.js";

export const fetchVideosByMood = async (mood) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .ilike("mood_tag", `%${mood}%`);

  if (error) throw error;
  return data;
};
