package com.example.mongo

import arrow.core.Either
import com.example.func.tryCatch
import com.example.pojos.PlaylistDto
import com.example.pojos.SavedMediaDto
import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Filters
import com.mongodb.client.model.UpdateOptions
import org.bson.Document

private const val DATABASE_NAME = "fugdj"
private const val DEFAULT_PLAYLIST_NAME = "_default"

data class MongoFunctions(
    val createMediaF: (userId: String, playlistId: String?, media: SavedMediaDto) -> Either<Error, Unit>,
    val getAllPlaylists: (userId: String) -> Either<Error, List<PlaylistDto>>
)

fun buildMongoFunctions(mongoConnectionString: String) = MongoFunctions(
    createMediaF = { userId, playlistId, media ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val updateOperation = Document(
                "\$push",
                Document(
                    "playlists.\$[playlist].media",
                    Document("\$each", listOf(Document().append("\$set", media)))
                )
            )
            val arrayFilters = listOf(Filters.eq("playlist.id", playlistId ?: DEFAULT_PLAYLIST_NAME))
            val updateOptions = UpdateOptions().arrayFilters(arrayFilters)

            collection.updateOne(Document("_id", userId), updateOperation, updateOptions)
        }
    },
    getAllPlaylists = { userId ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val filter = Document("_id", userId)
            val projection = Document("playlists", 1)
            val result = collection.find(filter).projection(projection).first()

            if (result != null) {
                result.getList("playlists", PlaylistDto::class.java)
            } else {
                emptyList()
            }
        }
    }
)

private fun <T> callMongoTryCatch(mongoConnectionString: String, f: (database: MongoDatabase) -> T): Either<Error, T> =
    tryCatch {
        val mongoClientSettings = MongoClientSettings.builder()
            .applyConnectionString(ConnectionString(mongoConnectionString))
            .build()

        val mongoClient = MongoClients.create(mongoClientSettings)
        val database = mongoClient.getDatabase(DATABASE_NAME)

        val result = f(database)

        mongoClient.close()

        result
    }.mapLeft {
        Error("Mongo error: ${it.message}")
    }