package com.example.state

import io.ktor.websocket.*
import java.util.concurrent.atomic.AtomicInteger

class Connection(val session: DefaultWebSocketSession, var username: String) {
    companion object {
        val lastId = AtomicInteger(0)
    }

    val id = lastId.getAndIncrement()
}