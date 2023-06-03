package com.example.events.outbound

import com.example.pojos.QueuedMediaDto
import com.example.events.IOutboundEvent
import com.example.events.OutboundEventType
import kotlinx.serialization.Serializable

@Serializable
data class OutboundNextMediaStarted(
    override val data: NextMediaStarted,
    override val type: OutboundEventType = OutboundEventType.NEXT_MEDIA_STARTED
) : IOutboundEvent<NextMediaStarted>

@Serializable
data class NextMediaStarted(
    val queuedMedia: QueuedMediaDto,
    val timeStarted: String
)