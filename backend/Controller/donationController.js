import {Donation} from '../Model/donationModel.js';

export const createDonation = async (req, res) => {
  try {
    const { donorName, bloodGroup, phone, hospital, date, message } = req.body;

    if (!donorName || !bloodGroup || !phone || !hospital || !date) {
      return res.status(400).json({ message: "All required fields must be filled!" });
    }

    const donation = await Donation.create({
      donorName,
      bloodGroup,
      phone,
      hospital,
      date,
      message: message || "",
      userId: req.user.id
    });

    return res.status(201).json(donation);
  } catch (err) {
    console.error("Donation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};