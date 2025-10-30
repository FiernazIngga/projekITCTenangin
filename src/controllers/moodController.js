// import { insertMood, fetchUserMood } from "../models/moodModels.js";

// export const insertMoodUser = async (req, res, next) => {
//   try {
//     const { user_id, mood, note } = req.body;
//     if (!user_id || !mood)
//       return res.status(400).json({ message: "user_id dan mood wajib diisi" });

//     const data = await insertMood(user_id, mood, note);
//     res.status(201).json({ message: "Mood berhasil dicatat!", data });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getUserMood = async (req, res, next) => {
//   try {
//     const { user_id } = req.params;
//     if (!user_id)
//       return res.status(400).json({ message: "user_id tidak ditemukan" });

//     const data = await fetchUserMood(user_id);
//     res.json(data);
//   } catch (err) {
//     next(err);
//   }
// };
