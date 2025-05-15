//https://www.cdc.gov/diabetes/php/data-research/appendix.html

// CDC Diabetes Data Scraper
// This script extracts data from tables on the CDC diabetes webpage

// Function to fetch the HTML content of the CDC webpage
async function fetchCDCPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching CDC page:', error);
    return null;
  }
}

// Function to extract tables from HTML content
function extractTables(htmlContent) {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Find all tables in the document
  const tables = doc.querySelectorAll('table');
  console.log(`Found ${tables.length} tables on the page`);
  
  return tables;
}

// Function to convert a table to an array of objects
function tableToArray(table) {
  const rows = table.querySelectorAll('tr');
  const tableData = [];
  
  // Extract headers (assuming first row contains headers)
  const headers = [];
  const headerCells = rows[0].querySelectorAll('th');
  
  // If there are no th elements, the first row might use td elements for headers
  if (headerCells.length === 0) {
    rows[0].querySelectorAll('td').forEach(cell => {
      headers.push(cell.textContent.trim());
    });
  } else {
    headerCells.forEach(cell => {
      headers.push(cell.textContent.trim());
    });
  }
  
  // Extract data rows (starting from index 1 to skip header)
  for (let i = 1; i < rows.length; i++) {
    const rowData = {};
    // Get all cells including th (row header) and td
    const cells = rows[i].querySelectorAll('th, td');
    
    // If first cell is a th, treat it as row header and include it as first column
    let cellIndexOffset = 0;
    if (cells.length > 0 && cells[0].tagName.toLowerCase() === 'th') {
      rowData[headers[0]] = cells[0].textContent.trim();
      cellIndexOffset = 1;
    }
    
    // Map remaining cells to headers starting from index 1 if offset, else 0
    for (let j = cellIndexOffset; j < headers.length; j++) {
      const cell = cells[j];
      rowData[headers[j]] = cell ? cell.textContent.trim() : '';
    }
    
    tableData.push(rowData);
  }
  
  return {
    headers: headers,
    data: tableData
  };
}

// Main function to scrape tables from the CDC diabetes page
async function scrapeCDCDiabetesData() {
  const url = 'https://www.cdc.gov/diabetes/php/data-research/appendix.html';
  console.log(`Fetching data from ${url}...`);
  
  const htmlContent = await fetchCDCPage(url);
  if (!htmlContent) return null;
  
  const tables = extractTables(htmlContent);
  const allTablesData = [];
  
  // Process each table
  tables.forEach((table, index) => {
    const tableData = tableToArray(table);
    
    // Get table caption or create a default one
    let tableCaption = "Table " + (index + 1);
    const captionElement = table.querySelector('caption');
    if (captionElement) {
      tableCaption = captionElement.textContent.trim();
    }
    
    allTablesData.push({
      tableId: index + 1,
      caption: tableCaption,
      headers: tableData.headers,
      data: tableData.data
    });
    
    console.log(`Processed Table ${index + 1}: ${tableCaption} with ${tableData.data.length} rows`);
  });
  
  return allTablesData;
}

// Function to display the extracted data
function displayExtractedData(tableData) {
  if (!tableData || tableData.length === 0) {
    console.log("No tables were found or extracted.");
    return;
  }
  
  console.log(`Successfully extracted data from ${tableData.length} tables:`);
  
  tableData.forEach(table => {
    console.log(`\nTable ${table.tableId}: ${table.caption}`);
    console.log(`Headers: ${table.headers.join(', ')}`);
    console.log(`Number of rows: ${table.data.length}`);
    console.log('Sample data (first row):', table.data[0]);
  });
}

// Usage example
export async function main() {
  console.log("Starting CDC Diabetes Data extraction...");
  const tableData = await scrapeCDCDiabetesData();
  displayExtractedData(tableData);
  
  // Return the extracted data for further use
  return tableData;
}

// Function to render tables into HTML
export function renderTables(allTablesData) {
  if (!allTablesData || allTablesData.length === 0) {
    console.log("No tables to display.");
    return;
  }

  const container = document.getElementById('tables-container');
  if (!container) {
    console.error("No container element found to display tables.");
    return;
  }

  container.innerHTML = ''; // Clear existing content

  allTablesData.forEach(table => {
    const tableElement = document.createElement('table');

    // Add caption
    const caption = document.createElement('caption');
    caption.textContent = table.caption || `Table ${table.tableId}`;
    tableElement.appendChild(caption);

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    table.headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tableElement.appendChild(thead);

    // Create body rows
    const tbody = document.createElement('tbody');
    table.data.forEach(rowData => {
      const row = document.createElement('tr');
      table.headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = rowData[header] || '';
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    tableElement.appendChild(tbody);

    container.appendChild(tableElement);
  });
}
