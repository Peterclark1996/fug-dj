package com.example.events.outbound

import com.example.events.IOutboundEvent
import com.example.events.OutboundEventType
import kotlinx.serialization.Serializable

@Serializable
data class OutboundUserSentMessage(
    override val data: UserSentMessage,
    override val type: OutboundEventType = OutboundEventType.USER_SENT_MESSAGE
) : IOutboundEvent<UserSentMessage>

@Serializable
data class UserSentMessage(
    val source: SourceType,
    val userId: String?,
    val username: String,
    val message: String,
    val timestamp: String
)

enum class SourceType {
    USER,
    SYSTEM
}