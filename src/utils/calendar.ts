import ical from 'node-ical';
import IcalExpander from 'ical-expander';
import { formatDate, formatTimeRange } from './dateFormat';
import type { CalendarEvent } from './types';

const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/dickensandballsworth%40gmail.com/public/basic.ics';

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    // Parse with node-ical first to get the base event data (includes venue info)
    const parsedEvents = await ical.async.fromURL(CALENDAR_URL);
    const eventDataMap = new Map();

    // Store venue/location/description data from each event by UID
    for (const key in parsedEvents) {
      const evt = parsedEvents[key];
      if (evt.type === 'VEVENT' && evt.uid) {
        eventDataMap.set(evt.uid, {
          location: evt.location || '',
          summary: evt.summary || '',
          description: evt.description || ''
        });
      }
    }

    // Fetch ICS again for ical-expander
    const response = await fetch(CALENDAR_URL);
    const icsText = await response.text();

    // Use ical-expander to expand recurring events
    const expander = new IcalExpander({ ics: icsText, maxIterations: 100 });
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    const expanded = expander.between(now, oneYearFromNow);
    const calendarEvents: CalendarEvent[] = [];

    // Process events
    for (const evt of expanded.events) {
      const event = processExpandedEvent(evt, eventDataMap);
      if (event) calendarEvents.push(event);
    }

    // Process recurring occurrences
    for (const occurrence of expanded.occurrences) {
      const event = processExpandedEvent(occurrence, eventDataMap);
      if (event) calendarEvents.push(event);
    }

    // Sort by start date
    calendarEvents.sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return calendarEvents;
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return [];
  }
}

function processExpandedEvent(evt: any, eventDataMap: Map<string, any>): CalendarEvent | null {
  try {
    // Get dates
    const startDate = evt.startDate?.toJSDate ? evt.startDate.toJSDate() : new Date(evt.startDate);
    const endDate = evt.endDate?.toJSDate ? evt.endDate.toJSDate() : new Date(evt.endDate);

    // Get UID to lookup event data
    let uid = '';
    if (evt.uid) {
      uid = evt.uid;
    } else if (evt.item && evt.item.uid) {
      // ical-expander puts the base event in 'item' property
      uid = evt.item.uid;
    } else if (evt.component) {
      uid = String(evt.component.getFirstPropertyValue('uid') || '');
    }

    // Get location, summary, and description from the event data map (from node-ical)
    let location = '';
    let summary = '';
    let description = '';

    if (uid && eventDataMap.has(uid)) {
      const eventData = eventDataMap.get(uid);
      location = eventData.location;
      summary = eventData.summary;
      description = stripGoogleMeetInfo(eventData.description);
    }

    const [venue, address] = parseVenueAndAddress(location, summary);

    return {
      venue,
      address,
      location,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      formattedDate: formatDate(startDate),
      timeRange: formatTimeRange(startDate, endDate),
      rawEvent: evt
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return null;
  }
}

function stripGoogleMeetInfo(description: string): string {
  if (!description) return '';

  // Remove Google Meet links and related text
  let cleaned = description
    // Remove Google Meet URLs
    .replace(/https?:\/\/meet\.google\.com\/[^\s]*/gi, '')
    // Remove Google Meet support URLs
    .replace(/https?:\/\/support\.google\.com\/[^\s]*/gi, '')
    // Remove common Google Meet phrases
    .replace(/join\s+with\s+google\s+meet:?/gi, '')
    .replace(/learn\s+more\s+about\s+meet\s+at:?/gi, '')
    // Clean up extra whitespace and line breaks
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

function parseVenueAndAddress(location: string, summary: string): [string, string] {
  // Use SUMMARY for venue name (includes emoji), parse LOCATION for address
  const venue = summary || 'TBA';

  // Parse LOCATION field for address (format: "Venue, Address, City, State, Country")
  if (location && location.includes(',')) {
    // Skip the first part (venue name) and use the rest as address
    const parts = location.split(',');
    const address = parts.slice(1).join(',').trim();
    return [venue, address];
  }

  // If no comma in location, just use the venue from summary
  return [venue, location || ''];
}
