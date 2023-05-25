package com.example.func

import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*

private const val ISO_8601_24H_FULL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"

fun utcNow() = Date().toIsoString()

private fun Date.toIsoString(): String {
    val dateFormat: DateFormat = SimpleDateFormat(ISO_8601_24H_FULL_FORMAT)
    return dateFormat.format(this)
}