package com.example.events.outbound

import kotlinx.serialization.Serializable

@Serializable
data class OutboundUserSentMessage(
    val username: String,
    val message: String
)