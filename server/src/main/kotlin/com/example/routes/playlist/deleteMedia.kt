package com.example.routes.playlist

import arrow.core.flatMap
import com.example.TEMP_USER_ID
import com.example.external.mongo.MongoFunctions
import com.example.func.toEither
import com.example.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.deleteMedia(mongoFunctions: MongoFunctions) =
    delete("/{playlistId}/media/{mediaId}") {
        val response = call.parameters["playlistId"].toEither().flatMap { playlistId ->
            call.parameters["mediaId"].toEither().flatMap { mediaId ->
                mongoFunctions.deleteMediaF(TEMP_USER_ID, playlistId, mediaId)
            }
        }

        call.respondWith(response)
    }