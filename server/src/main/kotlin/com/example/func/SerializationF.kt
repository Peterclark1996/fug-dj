package com.example.func

import arrow.core.left
import arrow.core.right
import com.example.BadRequestError
import com.example.events.IOutboundEvent
import com.example.events.InboundEvent
import io.ktor.websocket.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer
import org.bson.Document

val json = Json {
    encodeDefaults = true
    ignoreUnknownKeys = true
}

fun parseStringToEvent(body: String) =
    tryCatch { json.decodeFromString(InboundEvent.serializer(), body) }
        .mapLeft { e -> Error("Failed to parse event.", e) }

fun <T> KSerializer<T>.parse(body: String, userSuppliedData: Boolean) =
    tryCatch { json.decodeFromString(this, body) }.mapLeft {
        if (userSuppliedData) BadRequestError("Failed to parse body")
        else Error("Failed to parse body", it)
    }

fun <T> KSerializer<T>.parse(document: Document) = parse(document.toJson(), false)

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