import { fetchQuotes } from "../models/quoteModels.js";

export const getQuotes = async (req, res, next) => {
  try {
    const data = await fetchQuotes();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
