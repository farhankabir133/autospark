import { allDistricts } from './districts';
import { allThanas } from './thanas';

interface Upazila {
  en: string;
  bn: string;
}

interface District {
  bn: string;
  upazilas: Upazila[];
}

const BD_GEOGRAPHY: Record<string, District> = {};

// Create a map of district_id to thanas for efficient lookup
const thanasByDistrictId: { [key: string]: { en: string; bn: string }[] } = {};
for (const thana of allThanas) {
  if (!thanasByDistrictId[thana.district_id]) {
    thanasByDistrictId[thana.district_id] = [];
  }
  thanasByDistrictId[thana.district_id].push({
    en: thana.upazilla,
    bn: thana.bn_name,
  });
}

// Populate BD_GEOGRAPHY using the districts and the thana map
for (const district of allDistricts) {
  const districtNameEn = district.name;
  const upazilas = thanasByDistrictId[district.id] || [];
  
  // Sort upazilas alphabetically by English name
  upazilas.sort((a, b) => a.en.localeCompare(b.en));

  BD_GEOGRAPHY[districtNameEn] = {
    bn: district.bn_name,
    upazilas: upazilas,
  };
}

export { BD_GEOGRAPHY };
