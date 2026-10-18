import Donation from "../models/Donation.js";

export const getDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findOne();
    if (!donation) {
      donation = await Donation.create({});
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

export const updateDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findOne();
    if (!donation) {
      donation = await Donation.create(req.body);
    } else {
      donation = await Donation.findByIdAndUpdate(donation._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};
