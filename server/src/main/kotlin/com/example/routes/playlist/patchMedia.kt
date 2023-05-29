package com.example.routes.playlist

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.parse
import com.example.func.toEither
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
private data class PatchMediaDto(
    val displayName: String
)

fun Route.patchMedia(mongoFunctions: MongoFunctions) =
    patch("/{playlistId}/media/{mediaId}") {
        val jsonBody = this.call.receiveText()
        PatchMediaDto.serializer().parse(jsonBody).flatMap { dto ->
            call.parameters["playlistId"].toEither().flatMap { playlistId ->
                call.parameters["mediaId"].toEither().flatMap { mediaId ->
                    val userId = "6472888133a5d88dea146111"
                    mongoFunctions.updateMediaDisplayNameF(userId, playlistId, mediaId, dto.displayName)
                }
            }
        }.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respond(HttpStatusCode.OK) })
    }