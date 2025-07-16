import axios from "axios";

interface SteamAvatarResponse {
  response: {
    players: Array<{
      steamid: string;
      avatarfull: string;
      avatarmedium: string;
      avatar: string;
    }>;
  };
}

interface CachedAvatar {
  url: string;
  timestamp: number;
}

// Cache for Steam avatars with TTL
const avatarCache = new Map<string, CachedAvatar>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Retrieves a Steam user's avatar URL based on their Steam ID with caching
 * @param steamId - The Steam ID (64-bit format)
 * @returns Promise<string | undefined> - The avatar URL or undefined if not found
 */
export async function getSteamAvatarUrl(
  steamId: string
): Promise<string | undefined> {
  const now = Date.now();

  // Check cache first
  const cached = avatarCache.get(steamId);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.url;
  }

  try {
    const response = await axios.get<SteamAvatarResponse>(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
    );

    const players = response.data.response.players;

    if (players.length === 0) {
      return undefined;
    }

    const avatarUrl = players[0].avatar;

    // Cache the result
    avatarCache.set(steamId, {
      url: avatarUrl,
      timestamp: now,
    });

    return avatarUrl;
  } catch (error) {
    console.error(`Error fetching Steam avatar for ${steamId}:`, error);
    return undefined;
  }
}

/**
 * Cleans up expired cache entries
 */
function cleanupAvatarCache(): void {
  const now = Date.now();
  for (const [steamId, cached] of avatarCache.entries()) {
    if (now - cached.timestamp >= CACHE_TTL) {
      avatarCache.delete(steamId);
    }
  }
}

// Clean up cache every hour
setInterval(cleanupAvatarCache, 60 * 60 * 1000);
