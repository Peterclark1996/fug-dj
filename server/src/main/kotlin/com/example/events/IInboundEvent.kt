package com.example.events

import arrow.core.Either
import com.example.state.Connection
import com.example.state.ServerState
import java.util.concurrent.atomic.AtomicReference

interface IInboundEvent {
    suspend fun onReceive(currentConnection: Connection, serverState: AtomicReference<ServerState>): Either<Error, Unit>
}