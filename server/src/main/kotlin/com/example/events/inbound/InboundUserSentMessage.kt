package com.example.events.inbound

import arrow.core.Either
import arrow.core.right
import com.example.events.IReceivable
import com.example.state.Connection
import com.example.state.ServerState
import kotlinx.serialization.Serializable

@Serializable
data class InboundUserSentMessage(
    val username: String,
    val message: String
) : IReceivable {
    override suspend fun onReceive(currentConnection: Connection, serverState: ServerState): Either<Error, Unit> {
        return Unit.right()
    }
}