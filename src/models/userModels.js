import { supabase } from "../databases/supabaseClient.js";

// Ambil data user dari tabel "users"
export const getUserData = async (user_id) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, foto_profile, username, email, password")
            .eq("id", user_id) 
            .single(); 

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
        throw err;
    }
};
