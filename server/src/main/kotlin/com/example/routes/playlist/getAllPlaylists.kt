package com.example.routes.playlist

import com.example.TEMP_USER_ID
import com.example.external.mongo.MongoFunctions
import com.example.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.getAllPlaylists(mongoFunctions: MongoFunctions) = get {
    val response = mongoFunctions.getAllPlaylistsF(TEMP_USER_ID)
    call.respondWith(response)
}