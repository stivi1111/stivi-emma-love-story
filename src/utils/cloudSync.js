// Dual-Cloud Redundant Sync Engine for Stivi & Emma

const ENDPOINT_A = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fc7f83c1469c1';
const ENDPOINT_B = 'https://jsonblob.com/api/jsonBlob/019fc7a2-7eee-73b8-9f46-de2048252f0a';

export let isPushingCloud = false;

export const setCloudLock = (locked) => {
  isPushingCloud = locked;
};

export const getLocalPayload = () => {
  return {
    notes: JSON.parse(localStorage.getItem('stivi_emma_real_notes') || '[]'),
    places: JSON.parse(localStorage.getItem('stivi_emma_real_places') || '[]'),
    timeline: JSON.parse(localStorage.getItem('stivi_emma_real_timeline') || '[]'),
    bucketlist: JSON.parse(localStorage.getItem('stivi_emma_real_bucketlist') || '[]'),
    photos: JSON.parse(localStorage.getItem('stivi_emma_real_photos') || '[]'),
    quote: localStorage.getItem('stivi_emma_custom_quote') || 'Scrivi qui la vostra frase speciale... ✨',
    hugCount: parseInt(localStorage.getItem('stivi_emma_hug_count') || '0', 10),
    startDate: localStorage.getItem('stivi_emma_start_date') || '2023-04-27',
    upcomingDates: JSON.parse(localStorage.getItem('stivi_emma_upcoming_dates') || '{"anniversary":"2027-04-27","emmaBday":"2027-04-07","stiviBday":"2027-07-27","nextTrip":"2026-09-01"}')
  };
};

export const applyCloudPayload = (remoteData) => {
  if (!remoteData || typeof remoteData !== 'object') return false;
  if (isPushingCloud) return false;

  let updated = false;

  const updateCollection = (key, storageKey) => {
    if (remoteData[key] !== undefined && Array.isArray(remoteData[key])) {
      const currentStr = localStorage.getItem(storageKey) || '[]';
      const incomingStr = JSON.stringify(remoteData[key]);
      if (currentStr !== incomingStr) {
        localStorage.setItem(storageKey, incomingStr);
        updated = true;
      }
    }
  };

  updateCollection('notes', 'stivi_emma_real_notes');
  updateCollection('places', 'stivi_emma_real_places');
  updateCollection('timeline', 'stivi_emma_real_timeline');
  updateCollection('bucketlist', 'stivi_emma_real_bucketlist');
  updateCollection('photos', 'stivi_emma_real_photos');

  // Quote
  if (remoteData.quote !== undefined && typeof remoteData.quote === 'string') {
    const currentQuote = localStorage.getItem('stivi_emma_custom_quote');
    if (currentQuote !== remoteData.quote) {
      localStorage.setItem('stivi_emma_custom_quote', remoteData.quote);
      updated = true;
    }
  }

  // Hug count
  if (remoteData.hugCount !== undefined) {
    const currentHug = localStorage.getItem('stivi_emma_hug_count') || '0';
    if (currentHug !== remoteData.hugCount.toString()) {
      localStorage.setItem('stivi_emma_hug_count', remoteData.hugCount.toString());
      updated = true;
    }
  }

  // Start date
  if (remoteData.startDate !== undefined) {
    const currentStart = localStorage.getItem('stivi_emma_start_date');
    if (currentStart !== remoteData.startDate) {
      localStorage.setItem('stivi_emma_start_date', remoteData.startDate);
      updated = true;
    }
  }

  if (updated) {
    window.dispatchEvent(new Event('stivi_emma_cloud_synced'));
  }
  return updated;
};

// Push local state to BOTH cloud endpoints simultaneously
export const pushFullCloudPayload = async (payload = getLocalPayload()) => {
  isPushingCloud = true;

  const pushA = fetch(ENDPOINT_A, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name: 'Stivi & Emma Data', data: payload })
  }).catch(() => null);

  const pushB = fetch(ENDPOINT_B, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => null);

  try {
    await Promise.allSettled([pushA, pushB]);
    return true;
  } finally {
    setTimeout(() => { isPushingCloud = false; }, 800);
  }
};

// Pull remote state from Cloud (Tries Endpoint A first, falls back to Endpoint B)
export const pullFullCloudPayload = async () => {
  if (isPushingCloud) return { success: false, skipped: true };

  try {
    const resA = await fetch(`${ENDPOINT_A}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache, no-store' },
      cache: 'no-store'
    });

    if (resA.ok) {
      const objA = await resA.json();
      if (objA && objA.data && typeof objA.data === 'object') {
        const hasChanges = applyCloudPayload(objA.data);
        return { success: true, hasChanges, data: objA.data };
      }
    }
  } catch (e) {
    console.log('Endpoint A pull failed, trying Endpoint B:', e);
  }

  try {
    const resB = await fetch(`${ENDPOINT_B}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache, no-store' },
      cache: 'no-store'
    });

    if (resB.ok) {
      const dataB = await resB.json();
      if (dataB && typeof dataB === 'object') {
        const hasChanges = applyCloudPayload(dataB);
        return { success: true, hasChanges, data: dataB };
      }
    }
  } catch (e) {
    console.log('Endpoint B pull failed:', e);
  }

  return { success: false, hasChanges: false };
};

export const saveAndSyncCloud = async (storageKey, value) => {
  setCloudLock(true);
  if (typeof value === 'string') {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }
  const ok = await pushFullCloudPayload();
  window.dispatchEvent(new Event('stivi_emma_cloud_synced'));
  return ok;
};

export const pushToCloud = pushFullCloudPayload;
export const pullFromCloud = pullFullCloudPayload;
export const registerDeletedId = () => {};
