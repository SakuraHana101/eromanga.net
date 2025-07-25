// src/lib/utils/time.ts
import * as dateFnsTz from 'date-fns-tz';

export function formatThailandTime(date: Date): string {
  const timeZone = 'Asia/Bangkok';
  const zonedDate = dateFnsTz.utcToZonedTime(date, timeZone);
  return dateFnsTz.format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone });
}
