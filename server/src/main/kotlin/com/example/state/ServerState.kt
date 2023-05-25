package com.example.state

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import java.util.*

data class ServerState(
    var connections: Set<Connection> = Collections.synchronizedSet(LinkedHashSet())
) {
    private var isRunning = false

    fun start() {
        isRunning = true
        CoroutineScope(Job()).launch {
            while (isRunning) {
                // TODO Check currently playing media, if any have ended, broadcast the next media to every room
            }
        }
    }
}