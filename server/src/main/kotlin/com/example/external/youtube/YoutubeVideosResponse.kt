package com.example.external.youtube

import kotlinx.serialization.Serializable

@Serializable
data class YoutubeVideosResponse(
    val items: List<YoutubeVideo>
)

@Serializable
data class YoutubeVideo(
    val id: String,
    val snippet: YoutubeVideoSnippet,
    val contentDetails: YoutubeVideoContentDetails
)

@Serializable
data class YoutubeVideoSnippet(
    val title: String,
    val thumbnails: YoutubeVideoThumbnails
)

@Serializable
data class YoutubeVideoThumbnails(
    val standard: YoutubeVideoThumbnail,
)

@Serializable
data class YoutubeVideoThumbnail(
    val url: String
)

@Serializable
data class YoutubeVideoContentDetails(
    val duration: String
)