package com.example.routes.playlist

import arrow.core.flatMap
import arrow.core.left
import com.example.func.parse
import com.example.func.toEither
import com.example.mongo.MongoFunctions
import com.example.pojos.SavedMediaDto
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
private data class PostNewMediaDto(
    val url: String
)

fun Route.postNewMedia(mongoFunctions: MongoFunctions) = post("/{playlistId}/media") {
    val jsonBody = this.call.receiveText()
    PostNewMediaDto.serializer().parse(jsonBody).flatMap { dto ->
        val isYoutubeUrl = dto.url.contains("youtube.com/watch?v=")
        val regex = Regex("\\?v=([^&]+)")
        val mediaId = regex.find(dto.url)?.groupValues?.firstOrNull()

        if (!isYoutubeUrl || mediaId == null) {
            Error("Not a youtube video").left()
        } else {
            call.parameters["playlistId"].toEither().flatMap { playlistId ->
                val userId = "6472888133a5d88dea146111"
                mongoFunctions.createMediaF(userId, playlistId, SavedMediaDto("Display Name", mediaId, 0))
            }
        }
    }.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respond(HttpStatusCode.OK) })
}