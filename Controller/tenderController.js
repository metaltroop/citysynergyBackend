// tenderController.js
const { Tender } = require("../Models/Tendernew");

const { sequelize } = require('../Config/database');
const axios = require('axios');


const getbyfilterandsearch = async (req, res) => {
  const { search_by, search_term, filter_columns } = req.body;

  if (!search_by || !search_term) {
    return res.status(400).json({ 
      error: "search_by and search_term are required fields" 
    });
  }

  try {
    // Build the where clause
    const whereClause = {
      [search_by]: {
        [sequelize.Op.like]: `%${search_term}%`
      }
    };

    // Build attributes array for selecting columns
    const attributes = filter_columns ? 
      (Array.isArray(filter_columns) ? filter_columns : filter_columns.split(',')) : 
      undefined;

    const results = await Tender.findAll({
      attributes,
      where: whereClause
    });

    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ 
      error: "An error occurred while querying the database.",
      details: err.message 
    });
  }
};

// Get all tenders
const getalltenders = async (req, res) => {
  try {
    const results = await sequelize.query("SELECT * FROM tendernew", {
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
    const query = "SELECT * FROM tendernew WHERE Tender_ID = :id";
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


const checkClashes = async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    console.log(`Sending pincode ${pincode} to FastAPI service`);
    const response = await axios.post('https://citysynergybackendpython.onrender.com/check_clashes', { pincode });
    console.log("Received response from FastAPI:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling FastAPI service:", error.message);
    console.error("Full Error:", error);
    res.status(500).json({ error: "Error in calling Python API" });
  }
};

const getAreas = async (req, res) => {
  const { pincode, query } = req.query;

  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const areas = await Tender.findAll({
      attributes: ["area"],
      where: {
        pincode,
        area: { [Op.like]: `%${query || ""}%` },
      },
      group: ["area"],
    });

    res.json(areas.map((area) => ({ name: area.area })));
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLocalAreas = async (req, res) => {
  const { pincode, area, query } = req.query;

  if (!pincode || !area) {
    return res.status(400).json({ error: "Pincode and Area are required" });
  }

  try {
    const localAreas = await Tender.findAll({
      attributes: ["localArea"],
      where: {
        pincode,
        area,
        localArea: { [Op.like]: `%${query || ""}%` },
      },
      group: ["localArea"],
    });

    res.json(localAreas.map((localArea) => ({ name: localArea.localArea })));
  } catch (error) {
    console.error("Error fetching local areas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Export the functions
module.exports = {
  checkClashes,
  getbyfilterandsearch,
  getalltenders,
  gettenderbyID,
  getAreas,
  getLocalAreas
  
 
};
