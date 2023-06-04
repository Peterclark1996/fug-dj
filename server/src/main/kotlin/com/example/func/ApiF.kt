package com.example.func

import arrow.core.Either
import arrow.core.flatMap
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*

data class BadRequestError(override val message: String) : Error(message)
data class NotFoundError(override val message: String) : Error(message)
data class UnauthorizedError(override val message: String) : Error(message)

fun ApplicationCall.getUserId(): Either<UnauthorizedError, String> =
    principal<JWTPrincipal>()?.subject.toEither().mapLeft { UnauthorizedError("Unauthorized") }

suspend inline fun <reified T> ApplicationCall.respondWith(response: Either<Error, T>) =
    response.flatMap {
        it.encode()
    }.fold({
        this.handleFailureResponse(it)
    }, {
        this.respondText(it)
    })

suspend fun ApplicationCall.handleFailureResponse(error: Error) =
    when (error) {
        is BadRequestError -> this.respond(HttpStatusCode.BadRequest)
        is NotFoundError -> this.respond(HttpStatusCode.NotFound)
        else -> {
            println(error.message + "\n" + error.stackTraceToString())
            this.respond(HttpStatusCode.InternalServerError)
        }
    }