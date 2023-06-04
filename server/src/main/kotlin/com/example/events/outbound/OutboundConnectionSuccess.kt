package com.example.events.outbound

import com.example.events.IOutboundEvent
import com.example.events.OutboundEventType
import kotlinx.serialization.Serializable

@Serializable
data class OutboundConnectionSuccess(
    override val data: ConnectionSuccess,
    override val type: OutboundEventType = OutboundEventType.CONNECTION_SUCCESS
) : IOutboundEvent<ConnectionSuccess>

@Serializable
data class ConnectionSuccess(
    val message: String
)