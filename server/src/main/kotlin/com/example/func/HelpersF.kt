package com.example.func

import arrow.core.Either
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.*

private const val ISO_8601_24H_FULL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"

fun getEnvVar(name: String): Either<Error, String> =
    System.getenv(name).toEither("Environment variable $name is not set")

fun isoStringToZonedDateTime(isoString: String): ZonedDateTime =
    ZonedDateTime.parse(isoString, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ"))

fun utcNow() = Date().toIsoString()

private fun Date.toIsoString(): String {
    val dateFormat: DateFormat = SimpleDateFormat(ISO_8601_24H_FULL_FORMAT)
    return dateFormat.format(this)
}