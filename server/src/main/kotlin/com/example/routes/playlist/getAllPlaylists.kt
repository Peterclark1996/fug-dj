package com.example.routes.playlist

import arrow.core.flatMap
import com.example.func.encode
import com.example.mongo.MongoFunctions
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.getAllPlaylists(mongoFunctions: MongoFunctions) = get {
    mongoFunctions.getAllPlaylists("6472888133a5d88dea146111").flatMap { it.encode() }
        .fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respondText(it) })
}