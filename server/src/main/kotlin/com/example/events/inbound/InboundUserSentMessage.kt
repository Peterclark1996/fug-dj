package com.example.events.inbound

import arrow.core.Either
import arrow.core.right
import com.example.events.IInboundEvent
import com.example.state.Connection
import com.example.state.ServerState
import kotlinx.serialization.Serializable

@Serializable
data class InboundUserSentMessage(
    val username: String,
    val message: String
) : IInboundEvent {
    override suspend fun onReceive(currentConnection: Connection, serverState: ServerState): Either<Error, Unit> {
        return Unit.right()
    }
}