package com.example.events.outbound

import com.example.dtos.QueuedMediaDto
import kotlinx.serialization.Serializable

@Serializable
data class OutboundNextMediaStarted(
    val nextMedia: QueuedMediaDto,
)