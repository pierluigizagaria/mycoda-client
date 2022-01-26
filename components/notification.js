import * as Notifications from 'expo-notifications';
import { API } from '../config/config';

export async function registerForPushNotificationsAsync(accessToken) {
  const { data } = await Notifications.getExpoPushTokenAsync();
  console.log(data);
  return fetch(`${API.URL}/api/notifications/${data}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}