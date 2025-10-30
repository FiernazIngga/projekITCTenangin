// import { supabase } from "../databases/supabaseClient.js";

// // Simpan mood ke database
// export const insertMood = async (user_id, mood, note) => {
//   const { data, error } = await supabase
//     .from("moods")
//     .insert([{ user_id, mood, note }])
//     .select();

//   if (error) throw error;
//   return data;
// };

// // Ambil mood berdasarkan user_id
// export const fetchUserMood = async (user_id) => {
//   const { data, error } = await supabase
//     .from("moods")
//     .select("*")
//     .eq("user_id", user_id)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// };
