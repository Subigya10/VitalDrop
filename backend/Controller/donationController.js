import { Donation } from '../Model/donationModel.js';
import { Users } from '../Model/userModel.js';
import { sequelize } from '../Database/db.js';

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

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(donations);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        u."userId", 
        u."fullName", 
        u."bloodGroup",
        COUNT(d.id) AS "donationCount"
      FROM "Donations" d
      JOIN "users" u ON d."userId" = u."userId"
      GROUP BY u."userId", u."fullName", u."bloodGroup"
      ORDER BY "donationCount" DESC
      LIMIT 20
    `);

    const formatted = results.map(row => ({
      id: row.userId,
      fullName: row.fullName,
      bloodGroup: row.bloodGroup,
      donationCount: parseInt(row.donationCount),
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
// Admin: get ALL donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update donation status
export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const donation = await Donation.findByPk(id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    await donation.update({ status });
    res.status(200).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Not found' });
    await donation.destroy();
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};