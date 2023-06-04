package com.example.routes.user

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.external.mongo.MongoUserDataDto
import com.example.func.getUserId
import com.example.func.parse
import com.example.func.respondWith
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

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
                    mongoFunctions.upsertUser(
                        MongoUserDataDto(
                            userId,
                            dto.displayName,
                            emptyList()
                        )
                    )
                }
            }

        call.respondWith(response)
    }