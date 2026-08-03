// Zero-Cache Instant Full-Site Cloud Sync Engine for Stivi & Emma

const BACKUP_ENDPOINT = 'https://kvdb.io/stivi_emma_love_db_2023/full_backup';

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

export const applyCloudPayload = (data) => {
  if (!data || typeof data !== 'object') return false;
  let updated = false;

  const checkAndUpdate = (key, storageKey) => {
    if (data[key] !== undefined) {
      const current = localStorage.getItem(storageKey);
      const incoming = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
      if (current !== incoming) {
        localStorage.setItem(storageKey, incoming);
        updated = true;
      }
    }
  };

  checkAndUpdate('notes', 'stivi_emma_real_notes');
  checkAndUpdate('places', 'stivi_emma_real_places');
  checkAndUpdate('timeline', 'stivi_emma_real_timeline');
  checkAndUpdate('bucketlist', 'stivi_emma_real_bucketlist');
  checkAndUpdate('photos', 'stivi_emma_real_photos');
  checkAndUpdate('quote', 'stivi_emma_custom_quote');
  checkAndUpdate('startDate', 'stivi_emma_start_date');
  checkAndUpdate('upcomingDates', 'stivi_emma_upcoming_dates');

  if (data.hugCount !== undefined) {
    const currentHug = localStorage.getItem('stivi_emma_hug_count');
    if (currentHug !== data.hugCount.toString()) {
      localStorage.setItem('stivi_emma_hug_count', data.hugCount.toString());
      updated = true;
    }
  }

  if (updated) {
    window.dispatchEvent(new Event('stivi_emma_cloud_synced'));
  }
  return updated;
};

// Push local changes to cloud (Zero-Cache)
export const pushFullCloudPayload = async (payload = getLocalPayload()) => {
  try {
    const res = await fetch(`${BACKUP_ENDPOINT}?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    return res.ok;
  } catch (e) {
    console.log('Cloud push error:', e);
    return false;
  }
};

// Pull cloud changes to PC / Mobile (Zero-Cache)
export const pullFullCloudPayload = async () => {
  try {
    const res = await fetch(`${BACKUP_ENDPOINT}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
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

// Central helper to update local storage AND push to cloud in 1 line
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
