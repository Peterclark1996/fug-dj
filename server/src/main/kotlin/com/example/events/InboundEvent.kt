package com.example.events

import arrow.core.Either
import com.example.events.inbound.InboundUserSentMessage
import com.example.func.parse
import kotlinx.serialization.Serializable

@Serializable
data class InboundEvent(val type: InboundEventType, val jsonData: String)

fun deserializeEventData(event: InboundEvent): Either<Error, IInboundEvent> =
    when (event.type) {
        InboundEventType.USER_SENT_MESSAGE -> InboundUserSentMessage.serializer().parse(event.jsonData)
    }

