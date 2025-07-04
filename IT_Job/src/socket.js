import { API_ROOT } from "./utils/constants";
import { io } from "socket.io-client";
export const socket = io(API_ROOT)