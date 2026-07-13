import api from './axiosConfig';

export const getClasses = (userId: number) =>
  api.get(`/api/classes/${userId}`).then((r) => r.data);

export const joinClass = (userId: number, classCode: string) =>
  api.post('/api/classes/join', { user_id: userId, class_code: classCode }).then((r) => r.data);

export const getPerformance = (userId: number) =>
  api.get(`/api/performance/${userId}`).then((r) => r.data);

export const getNotifications = (userId: number) =>
  api.get(`/api/notifications/${userId}`).then((r) => r.data);

export const updateProfile = (userId: number, data: { full_name: string; section: string; year_level: number }) =>
  api.put(`/api/profile/${userId}`, data).then((r) => r.data);
