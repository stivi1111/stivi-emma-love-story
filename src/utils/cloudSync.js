// Simple, Reliable Canonical Cloud Sync Engine for Stivi & Emma

const JSONBLOB_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019fc7a2-7eee-73b8-9f46-de2048252f0a';

let isPushingCloud = false;

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

// Push local state to cloud via HTTP PUT
export const pushFullCloudPayload = async (payload = getLocalPayload()) => {
  isPushingCloud = true;
  try {
    const res = await fetch(JSONBLOB_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.log('Cloud push error:', e);
    return false;
  } finally {
    setTimeout(() => { isPushingCloud = false; }, 800);
  }
};

// Pull remote state from cloud via HTTP GET with zero browser cache
export const pullFullCloudPayload = async () => {
  if (isPushingCloud) return { success: false, skipped: true };

  try {
    const url = `${JSONBLOB_ENDPOINT}?t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const hasChanges = applyCloudPayload(data);
        return { success: true, hasChanges, data };
      }
    }
  } catch (e) {
    console.log('Cloud pull error:', e);
  }
  return { success: false, hasChanges: false };
};

export const saveAndSyncCloud = async (storageKey, value) => {
  if (typeof value === 'string') {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }
  await pushFullCloudPayload();
};

export const pushToCloud = pushFullCloudPayload;
export const pullFromCloud = pullFullCloudPayload;
export const registerDeletedId = () => {};
