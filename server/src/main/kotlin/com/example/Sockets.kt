package com.example

import arrow.core.flatMap
import com.example.events.deserializeEventData
import com.example.func.parseStringToEvent
import com.example.pojos.RoomState
import com.example.state.Connection
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.time.Duration
import java.util.concurrent.atomic.AtomicReference

fun Application.configureSockets(serverState: AtomicReference<ServerState>) {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        webSocket("/socket/room/{roomId}") {
            val thisConnection = Connection(this)

            serverState.get().connections += thisConnection

            val roomId = call.parameters["roomId"]

            if (roomId != null) {
                serverState.getAndUpdate { state ->
                    val roomState = state.rooms[roomId]

                    if (roomState == null) {
                        state.rooms[roomId] = RoomState(
                            roomId,
                            "Virtual Room (Not from DB): $roomId",
                            setOf(thisConnection),
                            emptySet(),
                            null,
                            null
                        )
                    } else {
                        state.rooms[roomId] = RoomState(
                            roomState.id,
                            roomState.displayName,
                            roomState.connectedUsers + thisConnection,
                            roomState.queue,
                            roomState.currentlyPlayingMedia,
                            roomState.currentlyPlayingMediaStartedAt
                        )
                    }

                    state
                }

                try {
                    for (frame in incoming) {
                        frame as? Frame.Text ?: continue
                        val receivedText = frame.readText()
                        parseStringToEvent(receivedText).flatMap(::deserializeEventData).map {
                            it.onReceive(thisConnection, serverState.get())
                        }
                    }
                } catch (e: Exception) {
                    println(e.localizedMessage)
                } finally {
                    serverState.get().connections -= thisConnection
                }
            }
        }
    }
}