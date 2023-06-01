package com.example.routes.playlist

import arrow.core.flatMap
import com.example.TEMP_USER_ID
import com.example.external.mongo.MongoFunctions
import com.example.func.parse
import com.example.func.toEither
import com.example.respondWith
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
private data class PatchMediaDto(
    val displayName: String
)

fun Route.patchMedia(mongoFunctions: MongoFunctions) =
    patch("/{playlistId}/media/{mediaId}") {
        val jsonBody = this.call.receiveText()
        val response = PatchMediaDto.serializer().parse(jsonBody, true).flatMap { dto ->
            call.parameters["playlistId"].toEither().flatMap { playlistId ->
                call.parameters["mediaId"].toEither().flatMap { mediaId ->
                    mongoFunctions.updateMediaDisplayNameF(TEMP_USER_ID, playlistId, mediaId, dto.displayName)
                }
            }
        }

        call.respondWith(response)
    }