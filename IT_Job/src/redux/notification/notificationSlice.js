import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxios from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: []
}

export const fetchJobNotificationsAPI = createAsyncThunk(
  'notifications/fetchJobNotificationsAPI',
  async (email) => {
    const res = await authorizedAxios.get(`${API_ROOT}/server/notifications/getNotifications?email=${email}`)
    return res.data
  }
)

export const markJobNotificationsAsReadAPI = createAsyncThunk(
  'notifications/markJobNotificationsAsReadAPI',
  async (email) => {
    await authorizedAxios.post(`${API_ROOT}/server/notifications/mark-read`, { email })
    return email
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = []
    },
    addNotifications: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    },
    markAllLocalAsRead: (state) => {
      state.currentNotifications = state.currentNotifications.map(n => ({ ...n, isRead: true }))
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobNotificationsAPI.fulfilled, (state, action) => {
      state.currentNotifications = Array.isArray(action.payload) ? action.payload : []
    })

    builder.addCase(markJobNotificationsAsReadAPI.fulfilled, (state) => {
      state.currentNotifications = state.currentNotifications.map(n => ({ ...n, isRead: true }))
    })
  }
})

export const {
  clearCurrentNotifications,
  addNotifications,
  markAllLocalAsRead
} = notificationsSlice.actions

export const selectCurrentNotifications = (state) => state.notifications.currentNotifications

export const notificationsReducer = notificationsSlice.reducer
