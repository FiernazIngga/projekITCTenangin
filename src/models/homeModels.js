import { supabase } from "../databases/supabaseClient.js";

export const kirimPesan = async (nama_pengirim, email_pengirim, pesan_pengirim) => {
    try {
        const { data, error } = await supabase
            .from("pesan_publik") // ✅ pastikan nama tabel ini benar
            .insert([
                {
                    nama_pengirim,
                    email_pengirim,
                    pesan_pengirim
                }
            ])
            .select();

        if (error) {
            console.error("Gagal mengirim pesan:", error.message);
        }

        console.log("Pesan berhasil dikirim:", data);
        return data; 
    } catch (err) {
        console.error("Terjadi error tak terduga:", err.message);
        return null;
    }
};
