package com.example.func

import com.example.events.InboundEvent
import io.ktor.websocket.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer

val json = Json { encodeDefaults = true }

fun parseStringToEvent(body: String) =
    tryCatch { Json.decodeFromString(InboundEvent.serializer(), body) }
        .mapLeft { e -> Error("Failed to parse event.", e) }

fun <T> KSerializer<T>.parse(body: String) = tryCatch { Json.decodeFromString(this, body) }

suspend inline fun <reified T : Any> DefaultWebSocketSession.sendEvent(event: T) =
    this.send(
        Frame.Text(
            json.encodeToString(
                serializer(),
                event
            )
        )
    )