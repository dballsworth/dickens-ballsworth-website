export interface CalendarEvent {
  venue: string;
  address: string;
  location: string; // Full location from calendar (without emoji)
  description?: string; // Event description with promotional text
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  formattedDate: string; // "March 13th (Friday)"
  timeRange: string; // "10:00 PM - 1:00 AM"
  rawEvent: any; // Original event data
}

export interface ParsedCalendar {
  events: CalendarEvent[];
  updatedAt: string;
}
