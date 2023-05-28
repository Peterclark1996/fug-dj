package com.example

import arrow.core.getOrHandle
import com.example.func.getEnvVar
import com.example.external.mongo.buildMongoFunctions
import com.example.state.ServerState
import com.example.external.youtube.buildYoutubeFunctions
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import java.util.concurrent.atomic.AtomicReference

private const val MONGO_CONNECTION_STRING_VAR_NAME = "MONGO_CONNECTION_STRING"
private const val YOUTUBE_API_KEY_VAR_NAME = "YOUTUBE_API_KEY"

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    val mongoFunctions = getEnvVar(MONGO_CONNECTION_STRING_VAR_NAME).map { mongoConnectionString ->
        buildMongoFunctions(mongoConnectionString)
    }.getOrHandle { throw it }

    val youtubeFunctions = getEnvVar(YOUTUBE_API_KEY_VAR_NAME).map { youtubeApiKey ->
        buildYoutubeFunctions(youtubeApiKey)
    }.getOrHandle { throw it }

    val serverState = AtomicReference(ServerState())
    serverState.get().start()

    configureSockets(serverState)
    configureSerialization()
    configureSecurity()
    configureHTTP()
    configureRouting(serverState, mongoFunctions, youtubeFunctions)
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.configureHTTP() {
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }
}