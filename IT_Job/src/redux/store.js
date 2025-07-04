import { configureStore } from '@reduxjs/toolkit';
import { employerReducer } from './employer/employerSlice';
import { combineReducers } from 'redux'
import { userReducer } from './user/userSlice';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { jobReducer } from './job/jobSlice'
import { applyReducer } from './apply/applySilce';
import { notificationsReducer } from './notification/notificationSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['employer', 'job', 'user', 'apply', 'notification']
}
const rootReducer = combineReducers({
    employer: employerReducer,
    job: jobReducer,
    user: userReducer,
    apply: applyReducer,
    notifications: notificationsReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Bỏ qua kiểm tra cho các action này
      },
    }),
});

