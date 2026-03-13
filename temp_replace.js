const fs = require('fs');
const content = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// Find and replace the fetchVehicles function
const startIndex = content.indexOf('const fetchVehicles = async () => {');
const endIndex = content.indexOf('const applyFilters = () => {');

if (startIndex !== -1 && endIndex !== -1) {
  const newFunction = `const fetchVehicles = async () => {
    setLoading(true);
    setVehicles(ALL_VEHICLES);
    setFilteredVehicles(ALL_VEHICLES);
    setLoading(false);
  };

  `;
  
  const newContent = content.substring(0, startIndex) + newFunction + content.substring(endIndex);
  fs.writeFileSync('src/pages/InventoryPage.tsx', newContent);
  console.log('File updated successfully');
} else {
  console.log('Could not find function boundaries');
}
