import Statistic from "../models/Statistic.js";

export const getStatistics = async (req, res, next) => {
  try {
    const stats = await Statistic.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const addStatistic = async (req, res, next) => {
  try {
    const { id, label, value, enabled, order } = req.body;
    const statId = id || `stat_${Date.now()}`;

    const stat = await Statistic.create({
      id: statId,
      label,
      value: value ?? null,
      enabled: enabled ?? true,
      order: order ?? 0,
    });

    res.status(201).json({ success: true, data: stat });
  } catch (error) {
    next(error);
  }
};

export const updateStatistic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stat = await Statistic.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stat) {
      return res.status(404).json({ success: false, message: "Statistic not found" });
    }

    res.json({ success: true, data: stat });
  } catch (error) {
    next(error);
  }
};

export const deleteStatistic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stat = await Statistic.findOneAndDelete({ id });

    if (!stat) {
      return res.status(404).json({ success: false, message: "Statistic not found" });
    }

    res.json({ success: true, message: "Statistic deleted successfully", id });
  } catch (error) {
    next(error);
  }
};
