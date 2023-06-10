package com.example.events.inbound

import arrow.core.Either
import arrow.core.flatMap
import com.example.events.IInboundEvent
import com.example.events.outbound.OutboundUserSentMessage
import com.example.events.outbound.SourceType
import com.example.events.outbound.UserSentMessage
import com.example.func.toEither
import com.example.func.utcNow
import com.example.state.Connection
import com.example.state.ServerState
import com.example.state.getRoomById
import com.example.state.sendToConnectedUsers
import kotlinx.serialization.Serializable
import java.util.concurrent.atomic.AtomicReference

@Serializable
data class InboundUserSentMessage(
    val message: String
) : IInboundEvent {
    override suspend fun onReceive(
        currentConnection: Connection,
        serverState: AtomicReference<ServerState>
    ): Either<Error, Unit> {
        if (message.length > 1000 || message.isEmpty()) {
            return Either.Left(Error("Message must be between 1 and 1000 characters"))
        }

        return currentConnection.roomId.toEither().flatMap { roomId ->
            serverState.getRoomById(roomId).flatMap {
                it.sendToConnectedUsers(
                    OutboundUserSentMessage(
                        UserSentMessage(
                            SourceType.USER,
                            currentConnection.userId,
                            currentConnection.username,
                            message,
                            utcNow()
                        )
                    )
                )
            }
        }
    }
}