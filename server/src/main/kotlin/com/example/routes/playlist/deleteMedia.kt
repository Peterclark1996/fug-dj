package com.example.routes.playlist

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.getUserId
import com.example.func.respondWith
import com.example.func.toEither
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.deleteMedia(mongoFunctions: MongoFunctions) =
    delete("/{playlistId}/media/{mediaId}") {
        val response =
            call.getUserId().flatMap { userId ->
                call.parameters["playlistId"].toEither().flatMap { playlistId ->
                    call.parameters["mediaId"].toEither().flatMap { mediaId ->
                        mongoFunctions.deleteMediaF(userId, playlistId, mediaId)
                    }
                }
            }

        call.respondWith(response)
    }