package com.example.func

import arrow.core.left
import arrow.core.right
import com.example.events.IOutboundEvent
import com.example.events.InboundEvent
import io.ktor.websocket.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer

val json = Json { encodeDefaults = true }

fun parseStringToEvent(body: String) =
    tryCatch { Json.decodeFromString(InboundEvent.serializer(), body) }
        .mapLeft { e -> Error("Failed to parse event.", e) }

fun <T> KSerializer<T>.parse(body: String) = tryCatch { Json.decodeFromString(this, body) }

inline fun <reified T> T.encode() = try {
    Json.encodeToString(this).right()
} catch (error: Error) {
    error.left()
}

suspend inline fun <reified TEvent : IOutboundEvent<TData>, reified TData> DefaultWebSocketSession.sendEvent(event: TEvent) =
    this.send(
        Frame.Text(
            json.encodeToString(
                serializer(),
                event
            )
        )
    )