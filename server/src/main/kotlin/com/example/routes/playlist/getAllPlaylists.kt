package com.example.routes.playlist

import com.example.external.mongo.MongoFunctions
import com.example.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.getAllPlaylists(mongoFunctions: MongoFunctions) = get {
    val response = mongoFunctions.getAllPlaylistsF("6472888133a5d88dea146111")
    call.respondWith(response)
}