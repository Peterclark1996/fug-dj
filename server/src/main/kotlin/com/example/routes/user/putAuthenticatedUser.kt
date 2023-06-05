package com.example.routes.user

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.left
import arrow.core.right
import com.example.external.mongo.MongoFunctions
import com.example.external.mongo.MongoUserDataDto
import com.example.func.BadRequestError
import com.example.func.getUserId
import com.example.func.parse
import com.example.func.respondWith
import com.example.pojos.PlaylistDto
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

private const val DEFAULT_PLAYLIST_ID = "_default"

@Serializable
private data class PutAuthenticatedUserDto(
    val displayName: String
)

fun Route.putAuthenticatedUser(mongoFunctions: MongoFunctions) =
    put {
        val jsonBody = this.call.receiveText()
        val response =
            call.getUserId().flatMap { userId ->
                PutAuthenticatedUserDto.serializer().parse(jsonBody, true).flatMap { dto ->
                    dto.validateDisplayName().flatMap { validatedDto ->
                        mongoFunctions.upsertUser(
                            userId,
                            MongoUserDataDto(
                                validatedDto.displayName,
                                listOf(
                                    PlaylistDto(
                                        id = DEFAULT_PLAYLIST_ID
                                    )
                                )
                            )
                        )
                    }
                }
            }

        call.respondWith(response)
    }

private fun PutAuthenticatedUserDto.validateDisplayName(): Either<BadRequestError, PutAuthenticatedUserDto> {
    if (this.displayName.trim().length < 3) {
        return BadRequestError("Display name must be at least 3 characters").left()
    }

    return PutAuthenticatedUserDto(this.displayName.trim()).right()
}