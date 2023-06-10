package com.example.state

import arrow.core.Either
import arrow.core.right
import arrow.core.traverseEither
import com.example.events.IOutboundEvent
import com.example.events.outbound.NextMediaStarted
import com.example.events.outbound.OutboundNextMediaStarted
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.func.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.Duration
import java.time.ZonedDateTime
import java.util.*
import java.util.concurrent.atomic.AtomicReference

fun AtomicReference<ServerState>.getRoomById(roomId: String) =
    this.get().rooms[roomId].toEither("Failed to find room with id: '${roomId}'")

suspend inline fun <reified TEvent : IOutboundEvent<TData>, reified TData> RoomState.sendToConnectedUsers(
    event: TEvent
): Either<Error, Unit> =
    connectedUsers.traverseEither { connection ->
        val session = connection.session
        if (session.closeReason.isActive) {
            session.sendEvent(event)
        } else {
            Unit.right()
        }
    }.mapToUnit()

data class ServerState(
    var connections: Set<Connection> = Collections.synchronizedSet(LinkedHashSet()),
    val rooms: MutableMap<String, RoomState> = Collections.synchronizedMap(LinkedHashMap())
) {
    private var isRunning = false

    fun start() {
        isRunning = true
        CoroutineScope(Job()).launch {
            while (isRunning) {
                delay(1000)

                val roomsWithFinishedMedia = rooms.values.filter { roomState ->
                    val media = roomState.currentlyPlayingMedia
                    val startedAt = roomState.currentlyPlayingMediaStartedAt?.let { isoStringToZonedDateTime(it) }

                    if (media == null || startedAt == null) {
                        false
                    } else {
                        val now = ZonedDateTime.now()
                        val duration = media.lengthInSeconds
                        val shouldFinishAt = startedAt + Duration.ofSeconds(duration.toLong())

                        now > shouldFinishAt
                    }
                }

                roomsWithFinishedMedia.forEach { roomState ->
                    val nextInQueue = roomState.queue.maxByOrNull { isoStringToZonedDateTime(it.timeQueued) }
                    if (nextInQueue == null) {
                        rooms[roomState.roomId] = roomState.copy(
                            currentlyPlayingMedia = null,
                            currentlyPlayingMediaStartedAt = null
                        )
                    } else {
                        val updatedRoom = roomState.copy(
                            queue = roomState.queue.filter { it.mediaId != nextInQueue.mediaId }.toSet(),
                            currentlyPlayingMedia = nextInQueue,
                            currentlyPlayingMediaStartedAt = utcNow()
                        )
                        rooms[roomState.roomId] = updatedRoom
                        roomState.sendToConnectedUsers(OutboundRoomStateUpdated(updatedRoom.toDto()))
                        roomState.sendToConnectedUsers(
                            OutboundNextMediaStarted(
                                NextMediaStarted(
                                    nextInQueue,
                                    utcNow()
                                )
                            )
                        )
                    }
                }
            }
        }
    }
}