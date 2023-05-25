package com.example.events.outbound

import com.example.dtos.QueuedMedia
import kotlinx.serialization.Serializable

@Serializable
data class OutboundNextMediaStarted(
    val nextMedia: QueuedMedia,
)