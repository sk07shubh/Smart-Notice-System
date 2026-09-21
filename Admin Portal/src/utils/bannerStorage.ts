import type { DashboardBanner } from '../types/adminBanner';
import { initialMockBanners } from '../types/adminBanner';

export const BANNER_STORAGE_KEY = 'icem_student_dashboard_banners';
export const BANNER_CHANNEL_NAME = 'icem_banner_sync_channel';

/**
 * Retrieves all stored banners from localStorage, falling back to initialMockBanners.
 */
export const getStoredBanners = (): DashboardBanner[] => {
  if (typeof window === 'undefined') return initialMockBanners;
  try {
    const raw = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!raw) {
      // Initialize with default mock banners if not set
      localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(initialMockBanners));
      return initialMockBanners;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialMockBanners;
  } catch (err) {
    console.error('Failed to parse stored banners from localStorage:', err);
    return initialMockBanners;
  }
};

/**
 * Saves banners list to localStorage and broadcasts the update across browser contexts.
 */
export const saveStoredBanners = (banners: DashboardBanner[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(banners));

    // 1. Dispatch custom event for same-page listeners
    window.dispatchEvent(new CustomEvent('icem-banner-update', { detail: banners }));

    // 2. Dispatch storage event for same-origin multi-tab listeners
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: BANNER_STORAGE_KEY,
        newValue: JSON.stringify(banners),
      })
    );

    // 3. Broadcast across BroadcastChannel if supported
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BANNER_CHANNEL_NAME);
      channel.postMessage({ type: 'UPDATE_BANNERS', banners });
      channel.close();
    }
  } catch (err) {
    console.error('Failed to save banners to localStorage:', err);
  }
};

/**
 * Retrieves only active banners for student portal consumption.
 */
export const getActiveBanners = (): DashboardBanner[] => {
  return getStoredBanners().filter((b) => b.isActive !== false);
};

/**
 * Toggles a banner's active/published status.
 */
export const toggleBannerStatus = (id: string): DashboardBanner[] => {
  const current = getStoredBanners();
  const updated = current.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
  saveStoredBanners(updated);
  return updated;
};

/**
 * Deletes a banner by ID.
 */
export const deleteStoredBanner = (id: string): DashboardBanner[] => {
  const current = getStoredBanners();
  const updated = current.filter((b) => b.id !== id);
  saveStoredBanners(updated);
  return updated;
};

/**
 * Resets banners to default institutional presets.
 */
export const resetToDefaultBanners = (): DashboardBanner[] => {
  saveStoredBanners(initialMockBanners);
  return initialMockBanners;
};
