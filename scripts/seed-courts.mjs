const GOOGLE_KEY = 'AIzaSyBtJgBIaQ93XocrZHUW7Gu8MzQ_7R6nTfk';
const SUPABASE_URL = 'https://lnqbfcezakpxmfuejnmp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_X10yjDRBXF8ToDivch5dkw_0lO-C2Bs';

const COURTS_TO_SEARCH = [
  'Parklands Sports Club Nairobi',
  'Nairobi International School James Gichuru Road',
  'Olive Crescent International School Kolobot Drive Nairobi',
  'Kasarani Indoor Arena Nairobi',
  'Karen Country Club Nairobi',
  'Kibera Community Basketball Court Nairobi',
  'Camp Toyoyo Jericho Nairobi',
  'Langata Down Court Nairobi',
  'The Tigress Lair Eastleigh Nairobi',
  'Lenana School Nairobi',
  'University of Nairobi Basketball Court',
  'Braeburn Schools Gitanga Road Nairobi',
];

async function searchPlace(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    const place = data.results[0];
    return {
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      google_rating: place.rating || null,
      google_reviews: place.user_ratings_total || null,
      photo_ref: place.photos ? place.photos[0].photo_reference : null,
    };
  }
  return null;
}

async function getPlaceDetails(place_id) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,photos,opening_hours&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

async function updateCourt(name, placeData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/courts?name=ilike.${encodeURIComponent('%' + name.split(' ')[0] + '%')}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      lat: placeData.lat,
      lng: placeData.lng,
      address: placeData.address,
      place_id: placeData.place_id,
      google_photo_ref: placeData.photo_ref,
      google_rating: placeData.google_rating,
      google_reviews: placeData.google_reviews,
    }),
  });
  return res.status;
}

async function main() {
  console.log('Starting Google Places court seeding...\n');
  for (const query of COURTS_TO_SEARCH) {
    console.log(`Searching: ${query}`);
    const place = await searchPlace(query);
    if (place) {
      console.log(`  Found: ${place.name}`);
      console.log(`  Address: ${place.address}`);
      console.log(`  Coords: ${place.lat}, ${place.lng}`);
      console.log(`  Rating: ${place.google_rating} (${place.google_reviews} reviews)`);
      console.log(`  Photo: ${place.photo_ref ? 'Yes' : 'No'}`);
      const status = await updateCourt(query.split(' ')[0], place);
      console.log(`  Updated in Supabase: ${status === 204 ? 'OK' : 'Check manually'}\n`);
    } else {
      console.log(`  Not found on Google Places\n`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('Done!');
}

main();