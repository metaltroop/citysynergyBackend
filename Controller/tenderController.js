// tenderController.js
const { Tender } = require("../Models/Tender");

const { sequelize } = require('../Config/database');
const axios = require('axios');


const getbyfilterandsearch = async (req, res) => {
  const { search_by, search_term, filter_columns } = req.body;

  if (!search_by || !search_term || !filter_columns) {
    return res
      .status(400)
      .json({ error: "Missing required fields in request body." });
  }

  const filterColumnsArray = Array.isArray(filter_columns)
    ? filter_columns
    : filter_columns.split(",");
  const columnsToSelect = filterColumnsArray
    .map((col) => `\`${col}\``)
    .join(",");

  const query = `
    SELECT ${columnsToSelect}
    FROM tenders
    WHERE \`${search_by}\` LIKE :searchTerm
  `;

  try {
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { searchTerm: `%${search_term}%` },
    });
    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while querying the database." });
  }
};

// Get all tenders
const getalltenders = async (req, res) => {
  try {
    const results = await sequelize.query("SELECT * FROM tenders", {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(results);
  } catch (err) {
    console.error("Error retrieving all tenders:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving all tenders." });
  }
};

// Get tender by ID
const gettenderbyID = async (req, res) => {
  const { id } = req.body; // Get 'id' from request body (make sure it's passed correctly)

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    // Ensure the query uses the correct replacement for ':id'
    const query = "SELECT * FROM tenders WHERE Tender_ID = :id";
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { id }, // Ensure 'id' is passed correctly for replacement
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "Tender not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error retrieving tender by ID:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the tender by ID." });
  }
};

//get tendert by location
const getTenderByLocation = async (req, res) => {
  // Extracting 'location' from the request body
  const { location } = req.body; // Input parameter from request body

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    // Update query to use LIKE for partial matching in the Tender_By_Location field
    const query =
      "SELECT * FROM tenders WHERE Tender_By_Location LIKE :location";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { location: `%${location}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this location" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by location:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by location.",
      });
  }
};

// Get tender by Tender_By_Department
const getTenderByDepartment = async (req, res) => {
  // Extracting 'department' from the request body
  const { department } = req.body;

  if (!department) {
    return res.status(400).json({ error: "Department is required" });
  }

  try {
    // Update query to use LIKE for partial matching in the Tender_By_Department field
    const query =
      "SELECT * FROM tenders WHERE Tender_By_Department LIKE :department";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { department: `%${department}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this department" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by department:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by department.",
      });
  }
};

//get by classification
const getTenderByClassification = async (req, res) => {
  // Extracting 'classification' from the request body
  const { classification } = req.body;

  if (!classification) {
    return res.status(400).json({ error: "Classification is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Tender_By_Classification field
    const query =
      "SELECT * FROM tenders WHERE Tender_By_Classification LIKE :classification";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { classification: `%${classification}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this classification" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by classification:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by classification.",
      });
  }
};

// Get tender by Sanction_Date
const getTenderBySanctionDate = async (req, res) => {
  // Extracting 'sanctionDate' from the request body
  const { sanctionDate } = req.body;

  if (!sanctionDate) {
    return res.status(400).json({ error: "Sanction Date is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Sanction_Date field
    const query =
      "SELECT * FROM tenders WHERE Sanction_Date LIKE :sanctionDate";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { sanctionDate: `%${sanctionDate}%` }, // Applying LIKE with % for partial match (e.g., '2024')
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this sanction date" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by sanction date:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by sanction date.",
      });
  }
};

// Get tender by Completion_Date
const getTenderByCompletionDate = async (req, res) => {
  // Extracting 'completionDate' from the request body
  const { completionDate } = req.body;

  if (!completionDate) {
    return res.status(400).json({ error: "Completion Date is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Completion_Date field
    const query =
      "SELECT * FROM tenders WHERE Completion_Date LIKE :completionDate";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { completionDate: `%${completionDate}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this completion date" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by completion date:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by completion date.",
      });
  }
};

//by sanction date
const getTenderBySanctionAmount = async (req, res) => {
  // Extracting 'sanctionAmount' from the request body
  const { sanctionAmount } = req.body;

  if (!sanctionAmount) {
    return res.status(400).json({ error: "Sanction Amount is required" });
  }

  try {
    // Query to search tenders by exact sanction amount
    const query =
      "SELECT * FROM tenders WHERE Sanction_Amount = :sanctionAmount";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { sanctionAmount }, // Direct match for the exact amount
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this sanction amount" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by sanction amount:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by sanction amount.",
      });
  }
};

//tender by total duration
const getTenderByTotalDurationDays = async (req, res) => {
  // Extracting 'totalDurationDays' from the request body
  const { totalDurationDays } = req.body;

  if (totalDurationDays === undefined || totalDurationDays === null) {
    return res.status(400).json({ error: "Total Duration Days is required" });
  }

  try {
    // Query to search tenders by exact Total_Duration_Days
    const query =
      "SELECT * FROM tenders WHERE Total_Duration_Days = :totalDurationDays";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { totalDurationDays }, // Exact match for the integer field
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this total duration" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by total duration days:", err);
    res
      .status(500)
      .json({
        error:
          "An error occurred while retrieving tenders by total duration days.",
      });
  }
};

//by priorities
const getTenderByPriorities = async (req, res) => {
  // Extracting 'priorities' from the request body
  const { priorities } = req.body;

  if (!priorities) {
    return res.status(400).json({ error: "Priorities is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Priorities field
    const query = "SELECT * FROM tenders WHERE Priorities LIKE :priorities";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { priorities: `%${priorities}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this priority" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by priorities:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by priorities.",
      });
  }
};

//by cancle accept
const getTenderByCancelAcceptTender = async (req, res) => {
  // Extracting 'cancelAcceptTenders' from the request body
  const { cancelAcceptTenders } = req.body;

  if (!cancelAcceptTenders) {
    return res
      .status(400)
      .json({ error: "Cancel/Accept Tenders input is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Cancel_Accept_Tenders field
    const query =
      "SELECT * FROM tenders WHERE Cancel_Accept_Tenders LIKE :cancelAcceptTenders";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { cancelAcceptTenders: `%${cancelAcceptTenders}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this input" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by Cancel/Accept Tenders:", err);
    res
      .status(500)
      .json({
        error:
          "An error occurred while retrieving tenders by Cancel/Accept Tenders.",
      });
  }
};

//tender status
const getTenderByTenderStatus = async (req, res) => {
  // Extracting 'tenderStatus' from the request body
  const { tenderStatus } = req.body;

  if (!tenderStatus) {
    return res.status(400).json({ error: "Tender status is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Tender_Status field
    const query =
      "SELECT * FROM tenders WHERE Tender_Status LIKE :tenderStatus";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { tenderStatus: `%${tenderStatus}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found matching this status" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by status:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving tenders by status." });
  }
};

//by complete or pending  // *http://localhost:3001/api/gettenderbycompletedpending*
const getTenderByCompletedPending = async (req, res) => {
  // Extracting 'completedPending' from the request body
  const { completedPending } = req.body;

  if (!completedPending) {
    return res
      .status(400)
      .json({ error: "Completed/Pending status is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Completed_Pending field
    const query =
      "SELECT * FROM tenders WHERE Completed_Pending LIKE :completedPending";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { completedPending: `%${completedPending}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({
          error: "No tenders found matching this Completed/Pending status",
        });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by Completed/Pending status:", err);
    res
      .status(500)
      .json({
        error:
          "An error occurred while retrieving tenders by Completed/Pending status.",
      });
  }
};

//by aquired agency
const getTenderByTenderAcquiredByAgency = async (req, res) => {
  // Extracting 'agency' from the request body
  const { agency } = req.body;

  if (!agency) {
    return res.status(400).json({ error: "Agency name is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Tender_Acquired_By_Agency field
    const query =
      "SELECT * FROM tenders WHERE Tender_Acquired_By_Agency LIKE :agency";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { agency: `%${agency}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found for this agency" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by agency:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving tenders by agency." });
  }
};

// by pincode
const getTenderByPincode = async (req, res) => {
  // Extracting 'pincode' from the request body
  const { pincode } = req.body;

  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    // Query to use LIKE for partial matching in the Pincode field
    const query = "SELECT * FROM tenders WHERE Pincode LIKE :pincode";

    // Use Sequelize's query method with replacements to safely pass parameters
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { pincode: `%${pincode}%` }, // Applying LIKE with % for partial match
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No tenders found for this pincode" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error retrieving tenders by pincode:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving tenders by pincode.",
      });
  }
};


const checkClashes = async (req, res) => {
  const { pincode } = req.body;
  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const response = await axios.post('https://citysynergybackendpython.onrender.com/check_clashes', { pincode });
    res.json(response.data);
  } catch (error) {
    console.error("Error calling FastAPI service:", error.message);
    res.status(500).json({ error: "Error in calling Python API" });
  }
};

const addTender = async (req, res) => {
  try {
      // Extract data from the request body
      const {
          Tender_ID,
          Tender_By_Location,
          Tender_By_Department,
          Tender_By_Classification,
          Sanction_Date,
          Completion_Date,
          Sanction_Amount,
          Total_Duration_Days,
          Priorities,
          Cancel_Accept_Tenders,
          Reason_for_Decision,
          Tender_Status,
          Reason_for_Status,
          Completed_Pending,
          Tender_Acquired_By_Agency,
          pincode
      } = req.body;

      // Create a new tender record in the database
      const newTender = await tenders.create({
          Tender_ID,
          Tender_By_Location,
          Tender_By_Department,
          Tender_By_Classification,
          Sanction_Date,
          Completion_Date,
          Sanction_Amount,
          Total_Duration_Days,
          Priorities,
          Cancel_Accept_Tenders,
          Reason_for_Decision,
          Tender_Status,
          Reason_for_Status,
          Completed_Pending,
          Tender_Acquired_By_Agency,
          pincode
      });

      // Send a success response with the created tender
      res.status(201).json({
          message: 'Tender added successfully',
          tender: newTender
      });
  } catch (error) {
      console.error('Error adding tender:', error);
      res.status(500).json({
          message: 'Failed to add tender',
          error: error.message
      });
  }
};

// Export the functions
module.exports = {
  addTender,
  checkClashes,
  getbyfilterandsearch,
  getalltenders,
  gettenderbyID,
  getTenderByLocation,
  getTenderByDepartment,
  getTenderByClassification,
  getTenderBySanctionDate,
  getTenderByCompletionDate,
  getTenderBySanctionAmount,
  getTenderByTotalDurationDays,
  getTenderByPriorities,
  getTenderByCancelAcceptTender,
  getTenderByTenderStatus,
  getTenderByCompletedPending,
  getTenderByTenderAcquiredByAgency,
  getTenderByPincode,

 
};
