import { BloodRequests } from "../Model/requestModel.js";

// Logic for the "Post Request" button
export const createBloodRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, hospitalLocation } = req.body;

    // FIX: We must include the requesterId from the decoded token (verifyToken)
    const newRequest = await BloodRequests.create({
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalLocation,
      requesterId: req.user.id, // This links the request to YOU
      status: "pending"
    });

    res.status(201).json({ 
      success: true, 
      message: "Request posted successfully!", 
      data: newRequest 
    });
  } catch (error) {
    // If you see "notNull Violation", it means req.user.id was missing
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

// Logic for the "Respond" button
export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const donorId = req.user.id; 

    const request = await BloodRequests.findByPk(id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Safety: Don't let someone respond to their own request
    if (request.requesterId === donorId) {
      return res.status(400).json({ success: false, message: "You cannot respond to your own request!" });
    }

    // Update the record with the donor's ID
    request.status = "accepted";
    request.donorId = donorId;
    await request.save();

    res.status(200).json({ success: true, message: "Request accepted! Go be a hero.", data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await BloodRequests.findAll({
      where: [
        { requesterId: userId },
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDonationCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await BloodRequests.count({
      where: { donorId: userId, status: "accepted" }
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: get ALL requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequests.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await BloodRequests.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    await request.update({ status });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequests.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    await request.destroy();
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};