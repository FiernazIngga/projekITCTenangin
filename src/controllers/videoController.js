// import { fetchVideosByMood } from "../models/videoModels.js";

// export const getVideos = async (req, res, next) => {
//   try {
//     const { mood } = req.query; // contoh: ?mood=senang

//     // Kalau tidak ada mood dikirim, kirim semua video
//     const data = await fetchVideosByMood(mood || "");

//     res.json(data);
//   } catch (err) {
//     next(err);
//   }
// };
