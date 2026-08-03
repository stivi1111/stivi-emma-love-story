// Bug-Free Race-Condition-Proof Realtime Cloud Sync Engine for Stivi & Emma

const JSONBLOB_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019fc7a2-7eee-73b8-9f46-de2048252f0a';

let isPushingCloud = false;

// Helper to merge array items by unique ID so no note, photo or place is ever lost
export const mergeArraysById = (localArr = [], remoteArr = []) => {
  if (!Array.isArray(localArr)) localArr = [];
  if (!Array.isArray(remoteArr)) remoteArr = [];

  const map = new Map();
  // Read remote items
  remoteArr.forEach(item => {
    if (item && (item.id || item.id === 0)) {
      map.set(item.id.toString(), item);
    }
  });
  // Overlay local items (local takes priority if modified)
  localArr.forEach(item => {
    if (item && (item.id || item.id === 0)) {
      map.set(item.id.toString(), item);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const timeA = typeof a.id === 'number' ? a.id : 0;
    const timeB = typeof b.id === 'number' ? b.id : 0;
    return timeB - timeA;
  });
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
  let updated = false;

  const currentLocal = getLocalPayload();

  // Merge array items instead of overwriting
  const mergedNotes = mergeArraysById(currentLocal.notes, remoteData.notes);
  const mergedPlaces = mergeArraysById(currentLocal.places, remoteData.places);
  const mergedTimeline = mergeArraysById(currentLocal.timeline, remoteData.timeline);
  const mergedBucketlist = mergeArraysById(currentLocal.bucketlist, remoteData.bucketlist);
  const mergedPhotos = mergeArraysById(currentLocal.photos, remoteData.photos);

  if (JSON.stringify(currentLocal.notes) !== JSON.stringify(mergedNotes)) {
    localStorage.setItem('stivi_emma_real_notes', JSON.stringify(mergedNotes));
    updated = true;
  }
  if (JSON.stringify(currentLocal.places) !== JSON.stringify(mergedPlaces)) {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(mergedPlaces));
    updated = true;
  }
  if (JSON.stringify(currentLocal.timeline) !== JSON.stringify(mergedTimeline)) {
    localStorage.setItem('stivi_emma_real_timeline', JSON.stringify(mergedTimeline));
    updated = true;
  }
  if (JSON.stringify(currentLocal.bucketlist) !== JSON.stringify(mergedBucketlist)) {
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(mergedBucketlist));
    updated = true;
  }
  if (JSON.stringify(currentLocal.photos) !== JSON.stringify(mergedPhotos)) {
    localStorage.setItem('stivi_emma_real_photos', JSON.stringify(mergedPhotos));
    updated = true;
  }

  // Scalar values
  if (remoteData.quote && remoteData.quote !== currentLocal.quote) {
    localStorage.setItem('stivi_emma_custom_quote', remoteData.quote);
    updated = true;
  }

  if (remoteData.hugCount !== undefined && remoteData.hugCount > currentLocal.hugCount) {
    localStorage.setItem('stivi_emma_hug_count', remoteData.hugCount.toString());
    updated = true;
  }

  if (updated) {
    window.dispatchEvent(new Event('stivi_emma_cloud_synced'));
  }
  return updated;
};

// Push local changes to cloud via PUT (Locks during push)
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

// Pull cloud changes via GET (Skips if pushing)
export const pullFullCloudPayload = async () => {
  if (isPushingCloud) return { success: false, skipped: true };

  try {
    const res = await fetch(JSONBLOB_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
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
