package com.example.events

import arrow.core.Either
import com.example.events.inbound.InboundUserSentMessage
import com.example.func.parse
import com.example.func.tryCatch
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class InboundEvent(val type: InboundEventType, val jsonData: String)

fun deserializeEventData(event: InboundEvent): Either<Error, IReceivable> =
    when (event.type) {
        InboundEventType.USER_SENT_MESSAGE -> InboundUserSentMessage.serializer().parse(event.jsonData)
    }

enum class InboundEventType {
    USER_SENT_MESSAGE
}