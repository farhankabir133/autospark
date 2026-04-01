import { allDistricts } from './districts';
import { allThanas } from './thanas';

export const bdDistricts = allDistricts.map(district => ({
  id: district.id,
  name: district.name,
}));

export const bdThanas: { [key: string]: { id: string; name: string }[] } = {};

allThanas.forEach(thana => {
  if (!bdThanas[thana.district_id]) {
    bdThanas[thana.district_id] = [];
  }
  bdThanas[thana.district_id].push({
    id: thana.id,
    name: thana.upazilla,
  });
});
