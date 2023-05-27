package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
class SavedMediaDto (
    val displayName: String,
    val mediaId: String,
    val lengthInSeconds: Int
)