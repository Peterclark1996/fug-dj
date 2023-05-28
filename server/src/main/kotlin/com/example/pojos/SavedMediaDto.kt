package com.example.pojos

import kotlinx.serialization.Serializable
import org.bson.Document

@Serializable
data class SavedMediaDto (
    val displayName: String,
    val mediaId: String,
    val lengthInSeconds: Int
) {
    fun toBsonDocument(): Document {
        val document = Document()
        document["displayName"] = displayName
        document["mediaId"] = mediaId
        document["lengthInSeconds"] = lengthInSeconds
        return document
    }
}