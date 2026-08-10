const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Ajv2020 = require('ajv/dist/2020'); // Import Ajv for Draft 2020-12
const addFormats = require('ajv-formats');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve static files

// Enable Draft 2020-12 support
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// JSON Schema for Timeline Data (Draft 2020-12)
const timelineSchema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "year": {
        "type": "string",
        "pattern": "^\\d{4}$"
      },
      "description": { "type": "string" },
      "p1": { "type": "string" },
      "p2": { "type": "string" },
      "p3": { "type": "string" }
    },
    "required": ["year", "description", "p1", "p2", "p3"],
    "additionalProperties": false
  }
};

// Function to Validate JSON
const validateJSON = (data, schema) => {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error("Validation Errors:", validate.errors);
    return false;
  }
  return true;
};

// Function to Read and Validate Timeline Data
const getTimelineData = () => {
  try {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf-8')).timeline;
    if (!validateJSON(data, timelineSchema)) {
      throw new Error("Invalid JSON structure for timeline data!");
    }
    return data;
  } catch (error) {
    console.error("Error reading timeline data:", error.message);
    throw new Error("Failed to load timeline data.");
  }
};

// API Endpoint to Get Timeline Data
app.get('/timeline', (req, res) => {
  try {
    const timelineData = getTimelineData();
    res.json({ timeline: timelineData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
