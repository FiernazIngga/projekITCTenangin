import { supabase } from "../databases/supabaseClient.js";

// Ambil data user dari tabel "users"
export const getUserData = async (user_id) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select(`
                id,
                foto_profile,
                username,
                email,
                password,
                created_at,
                umur,
                jenis_kelamin,
                lokasi
            `)
            .eq("id", user_id)
            .single(); 

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
        throw err;
    }
};

export const insertUserMood = async (user_id, mood, note) => {
    try {
        const { data, error } = await supabase
            .from('moods')
            .insert([{ user_id, mood, note }])
            .select();

        if (error) throw error;
        return data[0] || null;
    } catch (err) {
        console.error("Gagal insert mood:", err.message);
        return null;
    }
};

export const ambilMoodTerbaru = async (user_id) => {
    try {
        const { data, error } = await supabase
            .from('moods')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        return data || null;
    } catch (err) {
        console.error("Gagal ambil mood terbaru:", err.message);
        return null;
    }
};


export const getUserMoods = async (user_id) => {
    try {
        const { data, error } = await supabase
            .from('moods')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Gagal ambil semua mood user:", err.message);
        return [];
    }
};