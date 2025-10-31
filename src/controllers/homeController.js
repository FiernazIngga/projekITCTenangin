import { kirimPesan } from "../models/homeModels.js";

export const kirimPesanController = async (req, res) => {
    try {
        const { nama, email, pesan } = req.body;
        if (!nama || !email || !pesan)
            return res.status(400).json({ message: "Semua field wajib diisi" });

        const hasil = await kirimPesan(nama, email, pesan);

        if (!hasil) {
            return res.status(500).json({ message: "Pesan tidak terkirim" });
        }

        res.status(201).json({ message: "Pesan Terkirim" });
    } catch (err) {
        console.error("Error saat mengirim pesan:", err);
        res.status(500).json({ message: "Pesan tidak terkirim", error: err.message });
    }
};
