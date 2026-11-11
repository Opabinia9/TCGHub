export function dateStringToMessageDate(dateString: string | null, type: 'SPECIFIC' | 'GENERAL') {
  if (dateString == null) {
    return '';
  }
  const date = new Date(dateString);
  const now = new Date();
  if (
    date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth() &&
    date.getDate() >= now.getDate()
  ) {
    const minute = date.getMinutes();
    return `${date.getHours()}:${minute < 10 ? `0${minute}` : minute}`;
  } else if (
    date.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime()
  ) {
    if (type === 'GENERAL') {
      return `${date.toLocaleDateString('en-au', { weekday: 'short' })}`;
    } else if (type === 'SPECIFIC') {
      const minute = date.getMinutes();
      return `${date.toLocaleDateString('en-au', { weekday: 'short' })} ${date.getHours()}:${minute < 10 ? `0${minute}` : minute}`;
    } else {
      return "FIX ME, I'M IN dateStringToMessageDate";
    }
  } else {
    return "FIX ME, I'M IN dateStringToMessageDate";
  }
}
