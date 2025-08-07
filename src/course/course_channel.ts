// Provides a global instance of the broadcast channel that all the course
// scripts can share
import OcwBroadcastChannel from "../common/broadcast_channel";

export const broadcastChannel = new OcwBroadcastChannel();

export default broadcastChannel;
