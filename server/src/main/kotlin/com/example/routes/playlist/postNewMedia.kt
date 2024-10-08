package com.example.routes.playlist

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.left
import arrow.core.right
import com.example.external.mongo.MongoFunctions
import com.example.external.youtube.YoutubeFunctions
import com.example.func.*
import com.example.pojos.SavedMediaDto
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
private data class PostNewMediaDto(
    val url: String
)

fun Route.postNewMedia(mongoFunctions: MongoFunctions, youtubeFunctions: YoutubeFunctions) =
    post("/{playlistId}/media") {
        val jsonBody = this.call.receiveText()
        val response = call.getUserId().flatMap { userId ->
            PostNewMediaDto.serializer().parse(jsonBody, true).flatMap { dto ->
                val isYoutubeUrl = dto.url.contains("youtube.com/watch?v=")
                val regex = Regex("(?<=\\?v=)[^&]+")
                val videoId = regex.find(dto.url)?.groupValues?.firstOrNull()

                if (!isYoutubeUrl || videoId == null) {
                    BadRequestError("Not a youtube video").left()
                } else {
                    youtubeFunctions.getMediaInfoF(videoId).flatMap { videoInfos ->
                        tryCatch { videoInfos.items.single() }.flatMap { videoInfo ->
                            convertTimeStringToSeconds(videoInfo.contentDetails.duration).flatMap { mediaDuration ->
                                call.parameters["playlistId"].toEither().flatMap { playlistId ->
                                    val mediaId = "y$videoId"
                                    mongoFunctions.createMediaF(
                                        userId,
                                        playlistId,
                                        SavedMediaDto(
                                            mediaId,
                                            videoInfo.snippet.title,
                                            videoInfo.snippet.thumbnails.standard.url,
                                            mediaDuration
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        call.respondWith(response)
    }

private fun convertTimeStringToSeconds(timeString: String): Either<Error, Int> {
    val pattern = """PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?""".toRegex()
    val matchResult = pattern.find(timeString)

    if (matchResult != null) {
        val (hours, minutes, seconds) = matchResult.destructured
        val totalSeconds = (hours.toIntOrNull() ?: 0) * 3600 +
                (minutes.toIntOrNull() ?: 0) * 60 +
                (seconds.toIntOrNull() ?: 0)
        return totalSeconds.right()
    }

    return BadRequestError("Invalid time string").left()
}