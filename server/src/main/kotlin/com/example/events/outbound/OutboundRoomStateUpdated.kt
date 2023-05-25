package com.example.events.outbound

import com.example.pojos.RoomStateDto
import com.example.events.IOutboundEvent
import com.example.events.OutboundEventType
import kotlinx.serialization.Serializable

@Serializable
data class OutboundRoomStateUpdated(
    override val data: RoomStateDto,
    override val type: OutboundEventType = OutboundEventType.ROOM_STATE_UPDATED
): IOutboundEvent<RoomStateDto>