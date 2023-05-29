package com.example.external.youtube

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.left
import com.example.func.parse
import com.example.func.toEither
import okhttp3.OkHttpClient
import okhttp3.Request

data class YoutubeFunctions(
    val getMediaInfoF: (videoId: String) -> Either<Error, YoutubeVideosResponse>,
)

fun buildYoutubeFunctions(youtubeToken: String) = YoutubeFunctions { videoId ->
    val client = OkHttpClient()
    val url = "https://www.googleapis.com/youtube/v3/videos?id=$videoId&part=snippet,contentDetails&key=$youtubeToken"
    val request = Request.Builder()
        .url(url)
        .get()
        .build()

    val response = client.newCall(request).execute()
    if (!response.isSuccessful) {
        Error("Youtube API call failed").left()
    } else {
        response.body?.string().toEither().flatMap { YoutubeVideosResponse.serializer().parse(it, false) }
    }
}