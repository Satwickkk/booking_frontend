import { isApiError } from '../api/client';
import type { ErrorCode } from '../api/types';

// Friendly wording per error code. The server's own message is used when we
// don't have a better one (it already names allowed values, failing rules, etc.).
const FRIENDLY: Partial<Record<ErrorCode, string>> = {
  NETWORK: "Can't reach the server. Check that the backend is running.",
  FORBIDDEN: "You don't have access to this.",
  OWN_GROUP: "This is your own group, so you can't request to join it.",
  ALREADY_MEMBER: "You're already in this group.",
  DUPLICATE_REQUEST: "You've already asked to join. Wait for the owner to reply.",
  GROUP_FULL: 'This group just filled up.',
  GROUP_CLOSED: 'This group has already booked, so it is closed.',
  REQUEST_NOT_PENDING: 'This request was already handled. The list has been refreshed.',
  ALREADY_SAVED: 'Someone in the group already saved this room.',
  ALREADY_BOOKED: 'Your group already has a booking.',
  INTERNAL: 'Something went wrong on the server.',
};

export function errorMessage(e: unknown): string {
  if (!isApiError(e)) return e instanceof Error ? e.message : 'Something went wrong.';
  if (e.code === 'ROOMS_UNAVAILABLE') {
    const date = e.details[0]?.date;
    return date ? `Not enough rooms left on ${date}. Pick another option.` : e.message;
  }
  return FRIENDLY[e.code] ?? e.message;
}

/** Extra lines worth showing under the headline (failing rules, field issues). */
export function errorLines(e: unknown): string[] {
  if (!isApiError(e)) return [];
  if (e.code === 'VALIDATION_ERROR' || e.code === 'NOT_ELIGIBLE' || e.code === 'OUT_OF_DATA_RANGE') {
    return e.details.map((d) => d.issue).filter(Boolean);
  }
  return [];
}
