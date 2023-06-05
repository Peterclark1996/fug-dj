package com.example.routes.user

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.getUserId
import com.example.func.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.getAuthenticatedUser(mongoFunctions: MongoFunctions) = get {
    val response = call.getUserId().flatMap { userId -> mongoFunctions.getUserById(userId) }
    call.respondWith(response)
}