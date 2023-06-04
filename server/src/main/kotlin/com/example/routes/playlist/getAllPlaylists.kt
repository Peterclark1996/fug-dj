package com.example.routes.playlist

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.getUserId
import com.example.func.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.getAllPlaylists(mongoFunctions: MongoFunctions) = get {
    val response = call.getUserId().flatMap { userId -> mongoFunctions.getAllPlaylistsF(userId) }
    call.respondWith(response)
}