import { BloodRequests } from "../Model/requestModel.js";

// Logic for the "Post Request" button
export const createBloodRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, hospitalLocation } = req.body;

    // Use Sequelize to save to DB
    const newRequest = await BloodRequests.create({
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalLocation
    });

    res.status(201).json({ 
      success: true, 
      message: "Request posted successfully!", 
      data: newRequest 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logic to show requests in your Dashboard Table
export const getActiveRequests = async (req, res) => {
  try {
    const requests = await BloodRequests.findAll({
      where: { status: "pending" },
      order: [['createdAt', 'DESC']] // Newest first
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};