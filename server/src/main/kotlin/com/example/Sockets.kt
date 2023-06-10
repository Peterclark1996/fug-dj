package com.example

import arrow.core.flatMap
import arrow.core.getOrHandle
import com.auth0.jwt.JWT
import com.example.events.deserializeEventData
import com.example.events.outbound.ConnectionFailed
import com.example.events.outbound.ConnectionSuccess
import com.example.events.outbound.OutboundConnectionFailed
import com.example.events.outbound.OutboundConnectionSuccess
import com.example.external.mongo.MongoFunctions
import com.example.func.parseStringToEvent
import com.example.func.sendEvent
import com.example.state.Connection
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.time.Duration
import java.util.concurrent.atomic.AtomicReference

fun Application.configureSockets(serverState: AtomicReference<ServerState>, mongoFunctions: MongoFunctions) {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        webSocket("/socket/room/{roomId}") {
            val token = call.parameters["token"]
            if (token == null) {
                this.sendEvent(OutboundConnectionFailed(ConnectionFailed("No token provided")))
                close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "No token provided"))
                return@webSocket
            }

            val roomId = call.parameters["roomId"]
            if (roomId == null) {
                this.sendEvent(OutboundConnectionFailed(ConnectionFailed("No roomId provided")))
                close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "No roomId provided"))
                return@webSocket
            }

            val userId = JWT.decode(token).getClaim("sub")?.asString()
            if (userId == null) {
                this.sendEvent(OutboundConnectionFailed(ConnectionFailed("Invalid token")))
                close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Invalid token"))
                return@webSocket
            }
            val name = mongoFunctions.getUserByIdF(userId).map { it.displayName }.getOrHandle {
                this.sendEvent(OutboundConnectionFailed(ConnectionFailed("Invalid token")))
                close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Invalid token"))
                return@webSocket
            }

            val thisConnection = Connection(this, roomId, userId, name)

            serverState.get().connections += thisConnection

            val roomStateUnsafe = serverState.get().rooms[roomId]
            val roomStateDefaulted = roomStateUnsafe
                ?: mongoFunctions.getRoomByIdF(roomId).map { it.initialiseAsState() }.getOrHandle {
                    this.sendEvent(OutboundConnectionFailed(ConnectionFailed("Room does not exist")))
                    close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Room does not exist"))
                    return@webSocket
                }


            serverState.getAndUpdate { state ->
                val roomState = state.rooms[roomId]
                if (roomState == null) {
                    state.rooms[roomId] = roomStateDefaulted.withAddedConnection(thisConnection)
                } else {
                    state.rooms[roomId] = roomState.withAddedConnection(thisConnection)
                }

                state
            }

            thisConnection.session.sendEvent(OutboundConnectionSuccess(ConnectionSuccess("Connected to room: $roomId")))

            try {
                for (frame in incoming) {
                    frame as? Frame.Text ?: continue
                    val receivedText = frame.readText()
                    parseStringToEvent(receivedText).flatMap(::deserializeEventData).map {
                        it.onReceive(thisConnection, serverState)
                    }.tapLeft {
                        println(it)
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