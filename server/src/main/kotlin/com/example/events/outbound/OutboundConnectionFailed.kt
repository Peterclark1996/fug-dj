package com.example.events.outbound

import com.example.events.IOutboundEvent
import com.example.events.OutboundEventType
import kotlinx.serialization.Serializable

@Serializable
data class OutboundConnectionFailed(
    override val data: ConnectionFailed,
    override val type: OutboundEventType = OutboundEventType.CONNECTION_FAILED
) : IOutboundEvent<ConnectionFailed>

@Serializable
data class ConnectionFailed(
    val message: String
)